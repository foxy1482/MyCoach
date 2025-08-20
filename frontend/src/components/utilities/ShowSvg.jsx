import React from "react";

export function ShowSvg({ name, size, className = ""})
{
    try {
        return (
            <svg className={`${className} svg-icon m-auto`} width={size} height={size}>
                <use xlinkHref={`../../../img/sprite.svg#${name}`}></use>
            </svg>
        );
    } catch (error) {
        console.error(`Error loading SVG: ${svgName}`, error);
        return null;
    }
}