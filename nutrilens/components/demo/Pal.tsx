import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { demoColors as c } from "../../theme/demo";

/** The small peach-and-leaf companion in the Main reference. */
export function Pal({
  size = 80,
  happy = false,
}: {
  size?: number;
  happy?: boolean;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityLabel="Your smiling VitaPal"
    >
      <Ellipse cx="50" cy="90" rx="28" ry="5" fill={c.green} opacity={0.12} />
      <Path
        d="M49 25C46 9 62 5 70 9C66 20 57 25 49 25Z"
        fill={c.leaf}
        stroke={c.ink}
        strokeWidth="2"
      />
      <Path
        d="M49 28Q47 16 41 14"
        fill="none"
        stroke={c.ink}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M50 26C24 18 12 38 17 61C20 79 34 90 50 86C66 90 80 79 83 61C88 38 76 18 50 26Z"
        fill={c.peach}
        stroke={c.ink}
        strokeWidth="2"
      />
      <Circle cx="28" cy="61" r="6" fill={c.pink} />
      <Circle cx="72" cy="61" r="6" fill={c.pink} />
      <Circle cx="36" cy="51" r="3" fill={c.ink} />
      <Circle cx="64" cy="51" r="3" fill={c.ink} />
      <Path
        d={happy ? "M39 61Q50 80 61 61Z" : "M41 63Q50 72 59 63"}
        fill={happy ? c.ink : "none"}
        stroke={c.ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
