import React, { type JSX } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../Components/ui/tooltip"
type Props={
    hoverChildren:JSX.Element;
    contentChildren:JSX.Element;
    onClick ?:()=> void;
    disabled?:boolean
}
const TooltipComp = ({hoverChildren,contentChildren,onClick,disabled}:Props) => {
    return (
        <Tooltip >
            <TooltipTrigger asChild onClick={onClick} disabled={disabled}>
                {hoverChildren}
            </TooltipTrigger>
            <TooltipContent>
                {contentChildren}
            </TooltipContent>
        </Tooltip>
    )
}

export default TooltipComp