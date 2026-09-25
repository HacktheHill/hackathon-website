const restingFlag =
	"M100 48 C132 30 158 58 192 39 C221 21 242 38 265 22 L265 137 C238 148 219 122 190 135 C157 145 132 114 100 125 Z";
const wavingFlag =
	"M100 48 C133 61 161 26 192 38 C222 53 246 21 265 37 L265 152 C241 131 218 160 190 135 C158 115 133 143 100 125 Z";

export default function TimerFlag() {
	return (
		<svg className="timer-flag" viewBox="90 0 190 170" aria-hidden="true" focusable="false">
			<path d="M97 160 L100 17" fill="none" stroke="#5b0711" strokeWidth="5" strokeLinecap="round" />
			<circle cx="100" cy="15" r="6" fill="#8b111c" />
			<path className="flag-rest" d={restingFlag} fill="#bf2531" />
			<g className="flag-motion">
				<path d={restingFlag} fill="#bf2531">
					<animate
						attributeName="d"
						values={`${restingFlag};${wavingFlag};${restingFlag}`}
						dur="3.6s"
						repeatCount="indefinite"
						calcMode="spline"
						keyTimes="0;0.5;1"
						keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
					/>
				</path>
				<path
					d="M132 39 C145 40 155 46 165 47 L164 138 C153 135 141 123 130 122 Z"
					fill="#e44749"
					opacity="0.45"
				>
					<animate
						attributeName="d"
						values="M132 39 C145 40 155 46 165 47 L164 138 C153 135 141 123 130 122 Z;M132 49 C145 45 155 37 165 35 L164 126 C153 124 141 134 130 133 Z;M132 39 C145 40 155 46 165 47 L164 138 C153 135 141 123 130 122 Z"
						dur="3.6s"
						repeatCount="indefinite"
						calcMode="spline"
						keyTimes="0;0.5;1"
						keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
					/>
				</path>
			</g>
		</svg>
	);
}
