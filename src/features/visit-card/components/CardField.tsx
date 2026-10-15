type CardFieldProps = {
    label: string;
    value: string;
};

/**
 * Label/value pair on the printed card. Text is pure #000 on purpose: card
 * printers print true black with the sharp K panel, grey with blurry CMY dye.
 */
export function CardField({ label, value }: CardFieldProps) {
    return (
        <div className="flex flex-col">
            <span className="text-[11px] italic leading-[14px] text-black">
                {label}
            </span>
            <span className="text-[12px] font-semibold leading-[15px] text-black">
                {value}
            </span>
        </div>
    );
}

export default CardField;
