import "./styles.css"

export default function Input({ label, className = "", ...props }) {
    return (
        <div className={`input-group ${className}`}>
            {label && <label>{label}</label>}
            <input
                {...props}
            />
        </div>
    );
}