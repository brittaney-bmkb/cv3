import { useRef, useState } from "react";

const Tooltip = ({children, isTooltipVisible}) => {

    const [ tooltipPosition, setTooltipPosition ] = useState({x: 0, y: 0})
    const [ showTooltipContent, setShowTooltipContent ] = useState(false);
    const tooltipRef = useRef(document.createElement('div'))

    const handleMouseMove = (event) => {

        //console.log("mouse moving: ", event)

        const { clientX, clientY } = event

        const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
        const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        //+12 is added to give a spice between cursor and tooltip
        let tooltipX = clientX + 12;
        let tooltipY = clientY + 12;

        // Check if tooltip exceeds the right side of the viewport
        if (tooltipX + tooltipWidth > viewportWidth) {
            tooltipX = clientX - tooltipWidth - 10;
        }

        // Check if tooltip exceeds the bottom of the viewport
        if (tooltipY + tooltipHeight > viewportHeight) {
            tooltipY = viewportHeight - tooltipHeight - 10;
        }

        setTooltipPosition({ x: tooltipX, y: tooltipY });
    }

    return(
        <div
        onMouseMove={handleMouseMove}
        >
        {isTooltipVisible && (
            <div
            ref={tooltipRef}
            style={{
                top: tooltipPosition.y,
                left: tooltipPosition.x,
                zIndex: '2147483647'
            }}  
            >
                {children}
            </div>
        )}
    </div>
    )

}

export default Tooltip