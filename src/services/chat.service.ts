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
      const socketUrl = import.meta.env.VITE_API_SOCKET_BACKEND_URL || "http://localhost:8000";
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
}

export default ChatService;