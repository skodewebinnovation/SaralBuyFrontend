import { io, Socket } from "socket.io-client";

class ChatService {
  private static instance: ChatService;
  public socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public connect() {
    if (!this.socket) {
      const socketUrl =  import.meta.env.MODE === 'development' ? import.meta.env.VITE_BACKEND_URL :  import.meta.env.VITE_LIVE_BACKEND_SOCKET_URL
      console.log("[ChatService] Connecting to socket URL:", socketUrl);

      this.socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        forceNew: true,
        reconnection: true,
        timeout: 5000,
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id, "at", socketUrl);
        // Re-identify user on reconnect if userId is set
        if (this._identifiedUserId) {
          this.identify(this._identifiedUserId);
        }
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("❌ Socket disconnected:", this.socket?.id, `(${reason})`);
      });

      this.socket.on("connect_error", (err) => {
        console.error("🚫 Socket connection error:", err);
      });

      // ✅ Match backend events
      this.socket.on("receive_message", (data) => {
        console.log("📨 Message received:", data);
      });

      this.socket.on("user_typing", (data) => {
        console.log("⌨️ Typing status:", data);
      });

      this.socket.on("user_joined", (data) => {
        console.log("🙋 User joined:", data);
      });

      this.socket.on("user_left", (data) => {
        console.log("👋 User left:", data);
      });

      this.socket.on("room_joined", (data) => {
        console.log("✅ Room joined:", data);
      });

      this.socket.on("error", (data) => {
        console.error("⚠️ Socket error:", data);
      });

      // Notification event handler registry
      this._notificationListeners = [];
      this.socket.on("new_message_notification", (data) => {
        console.log("🔔 New message notification:", data);
        if (this._notificationListeners) {
          this._notificationListeners.forEach((cb) => cb(data));
        }
      });

      // Product notification event handler registry
      this._productNotificationListeners = [];
      this.socket.on("product_notification", (data) => {
        console.log("🛎️ Product notification received:", data);
        if (this._productNotificationListeners) {
          this._productNotificationListeners.forEach((cb) => cb(data));
        }
      });
    }
    return this.socket;
  }

  // FIXED: Join room with proper parameters including buyerId
  public joinRoom(userId: string, productId: string, sellerId: string, userType: "buyer" | "seller", buyerId?: string) {
    if (this.socket) {
      // Determine buyerId if not provided
      let finalBuyerId = buyerId;
      if (!finalBuyerId) {
        finalBuyerId = userType === 'buyer' ? userId : undefined;
      }
      
      console.log(`[ChatService] Joining room:`, {
        userId,
        productId,
        sellerId,
        userType,
        buyerId: finalBuyerId
      });
      
      this.socket.emit("join_room", { 
        userId, 
        productId, 
        sellerId, 
        userType,
        buyerId: finalBuyerId
      });
    }
  }

  // FIXED: Send message with buyerId parameter
  public sendMessage(productId: string, sellerId: string, message: string, senderId: string, senderType: string, buyerId?: string) {
    if (this.socket) {
      // Determine buyerId if not provided
      let finalBuyerId = buyerId;
      if (!finalBuyerId) {
        finalBuyerId = senderType === 'buyer' ? senderId : undefined;
      }
      
      console.log(`[ChatService] Sending message:`, {
        productId,
        sellerId,
        message,
        senderId,
        senderType,
        buyerId: finalBuyerId
      });
      
      this.socket.emit("send_message", { 
        productId, 
        sellerId, 
        message, 
        senderId, 
        senderType,
        buyerId: finalBuyerId
      });
    }
  }

  // FIXED: Typing indicator with buyerId
  public sendTyping(productId: string, userId: string, sellerId: string, isTyping: boolean, buyerId?: string) {
    if (this.socket) {
      const event = isTyping ? "typing_start" : "typing_stop";
      
      console.log(`[ChatService] Typing ${isTyping ? 'started' : 'stopped'}:`, {
        productId,
        userId,
        sellerId,
        buyerId
      });
      
      this.socket.emit(event, { 
        productId, 
        userId, 
        sellerId,
        buyerId
      });
    }
  }

  public disconnect() {
    if (this.socket) {
      console.log("[ChatService] Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
    }
  }
  // Identify the user to the backend for notification mapping
  private _identifiedUserId?: string;
  public identify(userId: string) {
    if (this.socket && userId) {
      this._identifiedUserId = userId;
      this.socket.emit("identify", { userId });
      console.log("[ChatService] Identified as user:", userId);
    }
  }

  // Register a callback for new message notifications (for navbar bell, etc)
  private _notificationListeners?: Array<(data: any) => void>;
  public onNewMessageNotification(cb: (data: any) => void) {
    if (!this._notificationListeners) this._notificationListeners = [];
    this._notificationListeners.push(cb);
  }

  // Register a callback for product notifications (for bell icon, etc)
  private _productNotificationListeners?: Array<(data: any) => void>;
  public onProductNotification(cb: (data: any) => void) {
    if (!this._productNotificationListeners) this._productNotificationListeners = [];
    this._productNotificationListeners.push(cb);
  }
  /**
   * Get all recent chats for a user.
   * @param userId The current user's ID.
   * @param callback Function to call with the recent chats data.
   */
  public getRecentChats(userId: string, callback: (data: any) => void) {
    if (this.socket && userId) {
      // Emit the event to request recent chats
      this.socket.emit("get_recent_chats", { userId });

      // Handler for the response
      const handler = (data: any) => {
        callback(data);
        // Remove this handler after first call to avoid memory leaks
        this.socket?.off("recent_chats", handler);
      };

      // Listen for the response
      this.socket.on("recent_chats", handler);
    } else {
      console.error("[ChatService] Socket not connected or userId missing for getRecentChats");
    }
  }
}


export default ChatService;