import { formatNumber } from "utils/formatNumber";

export const FormattedMetricNumber = ({ value }: { value: number }) => {
    let content = "0"
    let className = "text-gray-600"
  
    if (value < 0) {
      className = "text-red-600"
      content = formatNumber(value)
    } else if (value > 0) {
      className = "text-green-600"
      content = "+" + formatNumber(value)
    }
  
    return (
    <span className={className}>
        {content}
    </span>)
  };