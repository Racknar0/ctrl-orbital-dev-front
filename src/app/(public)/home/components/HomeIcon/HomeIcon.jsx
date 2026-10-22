import './HomeIcon.scss';
const paths = {"ArrowUpRight": ["M7 17 17 7M7 7h10v10"], "ArrowRight": ["M5 12h14m-6-6 6 6-6 6"], "ArrowLeft": ["M19 12H5m7 7-7-7 7-7"], "Plus": ["M12 5v14M5 12h14"], "Check": ["m5 12 4 4L19 6"], "Lightbulb": ["M9 18h6m-5 4h4m-5-8a6 6 0 1 1 6 0c-.8.7-1 1.4-1 2h-4c0-.6-.2-1.3-1-2Z"], "MessageSquare": ["M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z"], "Send": ["m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"], "ThumbsUp": ["M7 10v12H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3Zm0 0 5-8a3 3 0 0 1 2 3v5h5a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"] , "Wallet": ["M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v12H5a3 3 0 0 1-3-3V6", "M16 12h6v5h-6z"], "ShoppingBag": ["M5 7h14l2 14H3L5 7ZM9 7V5a3 3 0 0 1 6 0v2"], "House": ["m3 10 9-7 9 7v11h-6v-8H9v8H3Z"], "TrendingUp": ["m3 17 6-6 4 4 8-10m-6 0h6v6"], "Building2": ["M6 21V3h12v18M3 21h18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"], "Briefcase": ["M3 7h18v14H3zM8 7V3h8v4M3 12a22 22 0 0 0 18 0M12 11v4"], "Monitor": ["M3 3h18v14H3zM12 17v4m-5 0h10"], "Clock": ["M12 8v5l3 2"], "Moon": ["M20 15a9 9 0 0 1-11-11 9 9 0 1 0 11 11Z"], "Sun": ["M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"], "Menu": ["M4 6h16M4 12h16M4 18h16"], "X": ["m6 6 12 12M6 18 18 6"], "ChevronDown": ["m6 9 6 6 6-6"], "User": ["M5 21a7 7 0 0 1 14 0"], "Camera": ["M3 7h4l2-3h6l2 3h4v14H3z"], "Users": ["M2 21a6 6 0 0 1 12 0m3-6a5 5 0 0 1 5 5"], "Receipt": ["M5 2l2 2 2-2 3 2 3-2 2 2 2-2v20l-2-2-2 2-3-2-3 2-2-2-2 2ZM9 8h6m-6 4h6m-6 4h3"], "Scale": ["M12 3v18M6 21h12M4 7h16M5 7 2 15h6L5 7Zm14 0-3 8h6l-3-8Z"], "PieChart": ["M12 3v9h9a9 9 0 1 1-9-9Zm4 0v5h5a7 7 0 0 0-5-5Z"], "Zap": ["m13 2-9 12h7l-1 8L22 9h-8l-1-7Z"]};
export default function HomeIcon({ name, size = 20, strokeWidth = 1.7, className, ...props }) {
  return <svg className={`home-icon${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {paths[name]?.map((d, i) => <path key={i} d={d} />)}
    {name === 'Clock' && <circle cx="12" cy="12" r="9" />}
    {name === 'Sun' && <circle cx="12" cy="12" r="4" />}
    {name === 'User' && <circle cx="12" cy="7" r="4" />}
    {name === 'Users' && <><circle cx="8" cy="7" r="4" /><path d="M16 3a4 4 0 0 1 0 8" /></>}
    {name === 'Camera' && <circle cx="12" cy="13" r="4" />}
  </svg>;
}
export function ArrowUpRight(props) { return <HomeIcon name="ArrowUpRight" {...props} />; }
export function ArrowRight(props) { return <HomeIcon name="ArrowRight" {...props} />; }
export function ArrowLeft(props) { return <HomeIcon name="ArrowLeft" {...props} />; }
export function Plus(props) { return <HomeIcon name="Plus" {...props} />; }
export function Check(props) { return <HomeIcon name="Check" {...props} />; }
export function Lightbulb(props) { return <HomeIcon name="Lightbulb" {...props} />; }
export function MessageSquare(props) { return <HomeIcon name="MessageSquare" {...props} />; }
export function Send(props) { return <HomeIcon name="Send" {...props} />; }
export function ThumbsUp(props) { return <HomeIcon name="ThumbsUp" {...props} />; }
export function Wallet(props) { return <HomeIcon name="Wallet" {...props} />; }
export function ShoppingBag(props) { return <HomeIcon name="ShoppingBag" {...props} />; }
export function House(props) { return <HomeIcon name="House" {...props} />; }
export function TrendingUp(props) { return <HomeIcon name="TrendingUp" {...props} />; }
export function Building2(props) { return <HomeIcon name="Building2" {...props} />; }
export function Briefcase(props) { return <HomeIcon name="Briefcase" {...props} />; }
export function Monitor(props) { return <HomeIcon name="Monitor" {...props} />; }
export function Clock(props) { return <HomeIcon name="Clock" {...props} />; }
export function Moon(props) { return <HomeIcon name="Moon" {...props} />; }
export function Sun(props) { return <HomeIcon name="Sun" {...props} />; }
export function Menu(props) { return <HomeIcon name="Menu" {...props} />; }
export function X(props) { return <HomeIcon name="X" {...props} />; }
export function ChevronDown(props) { return <HomeIcon name="ChevronDown" {...props} />; }
export function User(props) { return <HomeIcon name="User" {...props} />; }
export function Camera(props) { return <HomeIcon name="Camera" {...props} />; }
export function Users(props) { return <HomeIcon name="Users" {...props} />; }
export function Receipt(props) { return <HomeIcon name="Receipt" {...props} />; }
export function Scale(props) { return <HomeIcon name="Scale" {...props} />; }
export function PieChart(props) { return <HomeIcon name="PieChart" {...props} />; }
export function Zap(props) { return <HomeIcon name="Zap" {...props} />; }
