/*
 * This file is auto generated with C++ programming language. 
 * All color functions come from: https://reference.wolfram.com/language/guide/ColorSchemes.html
 * Analysis RGB components of color gradients and fit using least square method
 * Some color functions don't work well, even they may look beautiful in preview images
 */


var ColorFunction = {
	AlpineColors: function AlpineColors(t) {
		var r = -1.46232 * Math.pow(t, 6) +6.54496 * Math.pow(t, 5) -10.9669 * Math.pow(t, 4) +8.17393 * Math.pow(t, 3) -1.92049 * Math.pow(t, 2) +0.36812 * t +0.276021,
			g = -2.50468 * Math.pow(t, 6) +6.20476 * Math.pow(t, 5) -6.28447 * Math.pow(t, 4) +4.37695 * Math.pow(t, 3) -1.88924 * Math.pow(t, 2) +0.755445 * t +0.349156,
			b = -7.59235 * Math.pow(t, 6) +32.55 * Math.pow(t, 5) -52.941 * Math.pow(t, 4) +39.8389 * Math.pow(t, 3) -12.3772 * Math.pow(t, 2) +0.96635 * t +0.467158;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	LakeColors: function LakeColors(t) {
		var r = 3.37668 * Math.pow(t, 6) -11.2764 * Math.pow(t, 5) +14.5566 * Math.pow(t, 4) -8.86927 * Math.pow(t, 3) +2.24078 * Math.pow(t, 2) +0.613423 * t +0.293718,
			g = 13.1495 * Math.pow(t, 6) -36.5644 * Math.pow(t, 5) +38.4761 * Math.pow(t, 4) -19.5545 * Math.pow(t, 3) +4.22866 * Math.pow(t, 2) +1.11198 * t +0.0548422,
			b = 14.3314 * Math.pow(t, 6) -49.8321 * Math.pow(t, 5) +66.6778 * Math.pow(t, 4) -41.698 * Math.pow(t, 3) +10.5939 * Math.pow(t, 2) +0.203727 * t +0.543448;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	ArmyColors: function ArmyColors(t) {
		var r = -11.7303 * Math.pow(t, 6) +30.8753 * Math.pow(t, 5) -27.7112 * Math.pow(t, 4) +9.04159 * Math.pow(t, 3) -0.119091 * Math.pow(t, 2) -0.0679552 * t +0.456894,
			g = -15.6966 * Math.pow(t, 6) +38.5569 * Math.pow(t, 5) -32.4906 * Math.pow(t, 4) +11.2731 * Math.pow(t, 3) -1.56984 * Math.pow(t, 2) +0.0656926 * t +0.593713,
			b = -5.41126 * Math.pow(t, 6) +11.2287 * Math.pow(t, 5) -5.51317 * Math.pow(t, 4) -1.81423 * Math.pow(t, 3) +2.44277 * Math.pow(t, 2) -0.789435 * t +0.514666;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	MintColors: function MintColors(t) {
		var r = 1.48156 * Math.pow(t, 6) -4.48765 * Math.pow(t, 5) +5.22291 * Math.pow(t, 4) -2.91648 * Math.pow(t, 3) +0.246744 * Math.pow(t, 2) +0.921419 * t +0.458638,
			g = 1.32874 * Math.pow(t, 6) -3.81756 * Math.pow(t, 5) +4.11354 * Math.pow(t, 4) -2.11698 * Math.pow(t, 3) +0.172674 * Math.pow(t, 2) -0.0625269 * t +0.985269,
			b = 1.85062 * Math.pow(t, 6) -5.54339 * Math.pow(t, 5) +6.36872 * Math.pow(t, 4) -3.53135 * Math.pow(t, 3) +0.424434 * Math.pow(t, 2) +0.573465 * t +0.640168;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	AtlanticColors: function AtlanticColors(t) {
		var r = 2.46758 * Math.pow(t, 6) -18.87 * Math.pow(t, 5) +35.9993 * Math.pow(t, 4) -28.2417 * Math.pow(t, 3) +9.12842 * Math.pow(t, 2) -0.182162 * t +0.144416,
			g = -0.620341 * Math.pow(t, 6) -7.69618 * Math.pow(t, 5) +23.0868 * Math.pow(t, 4) -23.5328 * Math.pow(t, 3) +9.0282 * Math.pow(t, 2) +0.0234611 * t +0.173309,
			b = -0.402741 * Math.pow(t, 6) -7.82095 * Math.pow(t, 5) +22.2695 * Math.pow(t, 4) -22.6761 * Math.pow(t, 3) +9.03805 * Math.pow(t, 2) +0.000336935 * t +0.17543;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	NeonColors: function NeonColors(t) {
		var r = -6.32582 * Math.pow(t, 6) +22.4345 * Math.pow(t, 5) -29.0842 * Math.pow(t, 4) +16.4884 * Math.pow(t, 3) -3.95363 * Math.pow(t, 2) +0.532444 * t +0.716297,
			g = 21.9631 * Math.pow(t, 6) -54.4859 * Math.pow(t, 5) +43.0162 * Math.pow(t, 4) -9.43067 * Math.pow(t, 3) -0.499973 * Math.pow(t, 2) -1.28989 * t +0.925189,
			b = 24.249 * Math.pow(t, 6) -76.439 * Math.pow(t, 5) +88.2323 * Math.pow(t, 4) -44.397 * Math.pow(t, 3) +9.67315 * Math.pow(t, 2) -0.841259 * t +0.312909;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	AuroraColors: function AuroraColors(t) {
		var r = -1.71889 * Math.pow(t, 6) -2.27585 * Math.pow(t, 5) +19.276 * Math.pow(t, 4) -25.8821 * Math.pow(t, 3) +12.8276 * Math.pow(t, 2) -1.62184 * t +0.269629,
			g = -1.32759 * Math.pow(t, 6) +16.7744 * Math.pow(t, 5) -33.6022 * Math.pow(t, 4) +20.6953 * Math.pow(t, 3) -2.15624 * Math.pow(t, 2) -0.374157 * t +0.258128,
			b = 2.68431 * Math.pow(t, 6) -7.90632 * Math.pow(t, 5) +0.0610652 * Math.pow(t, 4) +12.8019 * Math.pow(t, 3) -8.9129 * Math.pow(t, 2) +1.96572 * t +0.247668;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	PearlColors: function PearlColors(t) {
		var r = 2.83391 * Math.pow(t, 6) -7.57655 * Math.pow(t, 5) +2.99039 * Math.pow(t, 4) +7.58299 * Math.pow(t, 3) -6.65091 * Math.pow(t, 2) +0.9144 * t +0.897095,
			g = 3.17641 * Math.pow(t, 6) -9.53962 * Math.pow(t, 5) +6.59677 * Math.pow(t, 4) +4.67124 * Math.pow(t, 3) -6.16476 * Math.pow(t, 2) +1.27032 * t +0.829309,
			b = 5.33298 * Math.pow(t, 6) -14.167 * Math.pow(t, 5) +7.01967 * Math.pow(t, 4) +8.4996 * Math.pow(t, 3) -8.1096 * Math.pow(t, 2) +1.60461 * t +0.759874;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	AvocadoColors: function AvocadoColors(t) {
		var r = -7.60088 * Math.pow(t, 6) +27.8111 * Math.pow(t, 5) -38.6052 * Math.pow(t, 4) +23.4454 * Math.pow(t, 3) -4.22549 * Math.pow(t, 2) +0.175764 * t +0.000756962,
			g = 6.17629 * Math.pow(t, 6) -21.1977 * Math.pow(t, 5) +27.9683 * Math.pow(t, 4) -16.5719 * Math.pow(t, 3) +2.9541 * Math.pow(t, 2) +1.66389 * t -0.0075003,
			b = -0.0411061 * Math.pow(t, 6) -1.06536 * Math.pow(t, 5) +2.82422 * Math.pow(t, 4) -2.11745 * Math.pow(t, 3) +0.337216 * Math.pow(t, 2) +0.298234 * t -0.00294197;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	PlumColors: function PlumColors(t) {
		var r = 0.705406 * Math.pow(t, 6) -3.49336 * Math.pow(t, 5) +5.84276 * Math.pow(t, 4) -1.15656 * Math.pow(t, 3) -3.43981 * Math.pow(t, 2) +2.48303 * t -0.0166551,
			g = -0.127071 * Math.pow(t, 6) -0.00113619 * Math.pow(t, 5) +0.518881 * Math.pow(t, 4) +0.192909 * Math.pow(t, 3) -0.146759 * Math.pow(t, 2) +0.47497 * t -0.00296551,
			b = 1.18827 * Math.pow(t, 6) -2.70282 * Math.pow(t, 5) +1.99027 * Math.pow(t, 4) -2.4261 * Math.pow(t, 3) +2.1693 * Math.pow(t, 2) +0.198812 * t +0.00270943;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	BeachColors: function BeachColors(t) {
		var r = -8.69523 * Math.pow(t, 6) +24.8233 * Math.pow(t, 5) -21.9447 * Math.pow(t, 4) +6.79165 * Math.pow(t, 3) -1.03721 * Math.pow(t, 2) +0.2502 * t +0.857911,
			g = -7.17102 * Math.pow(t, 6) +20.2777 * Math.pow(t, 5) -17.4684 * Math.pow(t, 4) +5.00101 * Math.pow(t, 3) -1.10907 * Math.pow(t, 2) +0.9948 * t +0.498828,
			b = 6.99195 * Math.pow(t, 6) -20.0635 * Math.pow(t, 5) +16.9571 * Math.pow(t, 4) -3.2197 * Math.pow(t, 3) -0.139427 * Math.pow(t, 2) +0.203067 * t +0.257134;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	RoseColors: function RoseColors(t) {
		var r = -18.772 * Math.pow(t, 6) +56.6274 * Math.pow(t, 5) -59.9984 * Math.pow(t, 4) +24.972 * Math.pow(t, 3) -3.67499 * Math.pow(t, 2) +1.38446 * t +0.144352,
			g = -15.6555 * Math.pow(t, 6) +47.6402 * Math.pow(t, 5) -50.9672 * Math.pow(t, 4) +21.1572 * Math.pow(t, 3) -2.87795 * Math.pow(t, 2) +0.512946 * t +0.303361,
			b = -9.32239 * Math.pow(t, 6) +28.2008 * Math.pow(t, 5) -29.5672 * Math.pow(t, 4) +11.7069 * Math.pow(t, 3) -1.78896 * Math.pow(t, 2) +0.780706 * t +0.084707;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	CandyColors: function CandyColors(t) {
		var r = -10.5318 * Math.pow(t, 6) +24.3309 * Math.pow(t, 5) -14.9634 * Math.pow(t, 4) -0.515983 * Math.pow(t, 3) +0.575651 * Math.pow(t, 2) +1.36569 * t +0.402922,
			g = -21.3203 * Math.pow(t, 6) +64.2937 * Math.pow(t, 5) -72.0072 * Math.pow(t, 4) +35.0914 * Math.pow(t, 3) -5.8594 * Math.pow(t, 2) +0.468107 * t +0.197615,
			b = -10.63 * Math.pow(t, 6) +33.7268 * Math.pow(t, 5) -40.2239 * Math.pow(t, 4) +20.2007 * Math.pow(t, 3) -2.77366 * Math.pow(t, 2) +0.224614 * t +0.342971;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	SolarColors: function SolarColors(t) {
		var r = 6.99328 * Math.pow(t, 6) -23.0286 * Math.pow(t, 5) +29.2735 * Math.pow(t, 4) -16.9594 * Math.pow(t, 3) +2.95007 * Math.pow(t, 2) +1.31645 * t +0.465437,
			g = -0.905773 * Math.pow(t, 6) +5.77573 * Math.pow(t, 5) -10.7321 * Math.pow(t, 4) +7.29422 * Math.pow(t, 3) -1.09895 * Math.pow(t, 2) +0.49514 * t -0.000818759,
			b = -0.707665 * Math.pow(t, 6) +2.74569 * Math.pow(t, 5) -3.99793 * Math.pow(t, 4) +2.52126 * Math.pow(t, 3) -0.41024 * Math.pow(t, 2) -0.0388628 * t +0.0144711;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	CMYKColors: function CMYKColors(t) {
		var r = 9.34281 * Math.pow(t, 6) -32.7416 * Math.pow(t, 5) +40.6918 * Math.pow(t, 4) -24.5669 * Math.pow(t, 3) +6.04099 * Math.pow(t, 2) +1.01419 * t +0.295212,
			g = -40.9068 * Math.pow(t, 6) +155.609 * Math.pow(t, 5) -229.439 * Math.pow(t, 4) +154.759 * Math.pow(t, 3) -44.2032 * Math.pow(t, 2) +3.59531 * t +0.649671,
			b = -36.8916 * Math.pow(t, 6) +94.912 * Math.pow(t, 5) -98.4246 * Math.pow(t, 4) +54.1873 * Math.pow(t, 3) -15.6928 * Math.pow(t, 2) +1.04628 * t +0.900055;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	SouthwestColors: function SouthwestColors(t) {
		var r = -9.11936 * Math.pow(t, 6) +41.8423 * Math.pow(t, 5) -68.8105 * Math.pow(t, 4) +50.4802 * Math.pow(t, 3) -17.9477 * Math.pow(t, 2) +3.52598 * t +0.364523,
			g = -5.43101 * Math.pow(t, 6) +17.4865 * Math.pow(t, 5) -15.5857 * Math.pow(t, 4) -1.62205 * Math.pow(t, 3) +6.34913 * Math.pow(t, 2) -0.917008 * t +0.319467,
			b = -63.7371 * Math.pow(t, 6) +191.83 * Math.pow(t, 5) -202.577 * Math.pow(t, 4) +87.3159 * Math.pow(t, 3) -12.2429 * Math.pow(t, 2) +0.101498 * t +0.197917;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	DeepSeaColors: function DeepSeaColors(t) {
		var r = -7.31545 * Math.pow(t, 6) +13.31 * Math.pow(t, 5) -3.75123 * Math.pow(t, 4) -1.83143 * Math.pow(t, 3) -0.560149 * Math.pow(t, 2) +0.779769 * t +0.156216,
			g = -3.53306 * Math.pow(t, 6) +14.265 * Math.pow(t, 5) -21.3179 * Math.pow(t, 4) +13.3875 * Math.pow(t, 3) -2.16183 * Math.pow(t, 2) +0.286874 * t -9.48835e-05,
			b = 5.62199 * Math.pow(t, 6) -16.1938 * Math.pow(t, 5) +17.7046 * Math.pow(t, 4) -9.38477 * Math.pow(t, 3) +1.85801 * Math.pow(t, 2) +1.08822 * t +0.29789;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	StarryNightColors: function StarryNightColors(t) {
		var r = -6.48783 * Math.pow(t, 6) +25.3219 * Math.pow(t, 5) -37.2252 * Math.pow(t, 4) +23.8256 * Math.pow(t, 3) -5.75107 * Math.pow(t, 2) +1.19957 * t +0.0757066,
			g = -2.05517 * Math.pow(t, 6) +11.2997 * Math.pow(t, 5) -19.2277 * Math.pow(t, 4) +12.5614 * Math.pow(t, 3) -3.30531 * Math.pow(t, 2) +1.39211 * t +0.1372,
			b = -4.74264 * Math.pow(t, 6) +16.1424 * Math.pow(t, 5) -18.8412 * Math.pow(t, 4) +7.88982 * Math.pow(t, 3) -1.36251 * Math.pow(t, 2) +1.0689 * t +0.198336;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	FallColors: function FallColors(t) {
		var r = 8.3754 * Math.pow(t, 6) -24.0527 * Math.pow(t, 5) +22.8813 * Math.pow(t, 4) -8.10476 * Math.pow(t, 3) +1.06718 * Math.pow(t, 2) +0.523926 * t +0.257831,
			g = 12.5582 * Math.pow(t, 6) -37.4514 * Math.pow(t, 5) +37.226 * Math.pow(t, 4) -12.3842 * Math.pow(t, 3) +0.330326 * Math.pow(t, 2) +0.112072 * t +0.394514,
			b = -2.72839 * Math.pow(t, 6) +8.54889 * Math.pow(t, 5) -9.65924 * Math.pow(t, 4) +4.28072 * Math.pow(t, 3) +0.169826 * Math.pow(t, 2) -0.753583 * t +0.397609;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	SunsetColors: function SunsetColors(t) {
		var r = -10.2457 * Math.pow(t, 6) +20.5472 * Math.pow(t, 5) -4.52495 * Math.pow(t, 4) -12.5935 * Math.pow(t, 3) +6.2716 * Math.pow(t, 2) +1.53734 * t +0.0070273,
			g = 6.28519 * Math.pow(t, 6) -15.3752 * Math.pow(t, 5) +10.6425 * Math.pow(t, 4) -0.620113 * Math.pow(t, 3) -0.868161 * Math.pow(t, 2) +0.940185 * t -0.00599704,
			b = 38.9567 * Math.pow(t, 6) -113.737 * Math.pow(t, 5) +110.123 * Math.pow(t, 4) -27.4458 * Math.pow(t, 3) -12.0644 * Math.pow(t, 2) +5.27785 * t -0.0610802;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	FruitPunchColors: function FruitPunchColors(t) {
		var r = 4.40127 * Math.pow(t, 6) -13.2731 * Math.pow(t, 5) +12.1655 * Math.pow(t, 4) -1.08776 * Math.pow(t, 3) -2.48584 * Math.pow(t, 2) +0.26401 * t +0.993412,
			g = -5.11393 * Math.pow(t, 6) +14.6292 * Math.pow(t, 5) -12.4164 * Math.pow(t, 4) +3.23882 * Math.pow(t, 3) -1.3894 * Math.pow(t, 2) +0.921126 * t +0.498199,
			b = 9.4907 * Math.pow(t, 6) -26.7344 * Math.pow(t, 5) +22.4633 * Math.pow(t, 4) -6.08035 * Math.pow(t, 3) +1.51549 * Math.pow(t, 2) -0.149235 * t +0.00349165;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	ThermometerColors: function ThermometerColors(t) {
		var r = -1.7992 * Math.pow(t, 6) +2.2605 * Math.pow(t, 5) +5.46021 * Math.pow(t, 4) -12.6391 * Math.pow(t, 3) +6.54576 * Math.pow(t, 2) +0.519696 * t +0.164535,
			g = 9.9708 * Math.pow(t, 6) -31.5508 * Math.pow(t, 5) +43.8447 * Math.pow(t, 4) -32.2474 * Math.pow(t, 3) +8.3112 * Math.pow(t, 2) +1.6507 * t +0.115477,
			b = -5.2748 * Math.pow(t, 6) +15.3227 * Math.pow(t, 5) -15.369 * Math.pow(t, 4) +7.41579 * Math.pow(t, 3) -4.12554 * Math.pow(t, 2) +1.39424 * t +0.793642;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	IslandColors: function IslandColors(t) {
		var r = -2.68783 * Math.pow(t, 6) +8.84766 * Math.pow(t, 5) -3.96503 * Math.pow(t, 4) -11.5311 * Math.pow(t, 3) +12.5598 * Math.pow(t, 2) -3.34364 * t +0.794907,
			g = -0.887749 * Math.pow(t, 6) +7.12701 * Math.pow(t, 5) -14.6483 * Math.pow(t, 4) +13.1353 * Math.pow(t, 3) -7.10939 * Math.pow(t, 2) +2.81516 * t +0.34768,
			b = -3.08578 * Math.pow(t, 6) +16.3465 * Math.pow(t, 5) -29.174 * Math.pow(t, 4) +24.6368 * Math.pow(t, 3) -13.1574 * Math.pow(t, 2) +4.55271 * t +0.176807;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	WatermelonColors: function WatermelonColors(t) {
		var r = 6.32723 * Math.pow(t, 6) -18.137 * Math.pow(t, 5) +16.527 * Math.pow(t, 4) -4.97606 * Math.pow(t, 3) -0.400769 * Math.pow(t, 2) +1.41973 * t +0.0913623,
			g = 6.19473 * Math.pow(t, 6) -17.5141 * Math.pow(t, 5) +16.5417 * Math.pow(t, 4) -6.99174 * Math.pow(t, 3) +0.0240004 * Math.pow(t, 2) +1.99865 * t +0.0917481,
			b = 9.67905 * Math.pow(t, 6) -27.1167 * Math.pow(t, 5) +23.9863 * Math.pow(t, 4) -8.69715 * Math.pow(t, 3) +1.71482 * Math.pow(t, 2) +0.667485 * t +0.0988399;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	BrassTones: function BrassTones(t) {
		var r = 36.2274 * Math.pow(t, 6) -123.04 * Math.pow(t, 5) +162.681 * Math.pow(t, 4) -104.31 * Math.pow(t, 3) +29.3637 * Math.pow(t, 2) -0.952129 * t +0.187811,
			g = 31.6628 * Math.pow(t, 6) -108.621 * Math.pow(t, 5) +145.157 * Math.pow(t, 4) -94.3192 * Math.pow(t, 3) +27.1791 * Math.pow(t, 2) -1.10343 * t +0.195261,
			b = 14.5656 * Math.pow(t, 6) -50.4101 * Math.pow(t, 5) +68.3098 * Math.pow(t, 4) -45.3198 * Math.pow(t, 3) +13.3322 * Math.pow(t, 2) -0.511257 * t +0.0678581;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	GreenPinkTones: function GreenPinkTones(t) {
		var r = -49.1071 * Math.pow(t, 6) +147.945 * Math.pow(t, 5) -157.743 * Math.pow(t, 4) +61.4693 * Math.pow(t, 3) -1.70111 * Math.pow(t, 2) -0.729232 * t +0.0249309,
			g = -50.0461 * Math.pow(t, 6) +138.467 * Math.pow(t, 5) -135.082 * Math.pow(t, 4) +58.6324 * Math.pow(t, 3) -17.3062 * Math.pow(t, 2) +5.16441 * t +0.191531,
			b = -53.0851 * Math.pow(t, 6) +164.42 * Math.pow(t, 5) -184.457 * Math.pow(t, 4) +82.5641 * Math.pow(t, 3) -9.74717 * Math.pow(t, 2) +0.439897 * t +0.0279032;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	BrownCyanTones: function BrownCyanTones(t) {
		var r = -6.37218 * Math.pow(t, 6) +15.9367 * Math.pow(t, 5) -11.7946 * Math.pow(t, 4) +1.53389 * Math.pow(t, 3) -1.19643 * Math.pow(t, 2) +1.85737 * t +0.340867,
			g = -2.98 * Math.pow(t, 6) +8.20801 * Math.pow(t, 5) -8.88351 * Math.pow(t, 4) +3.89855 * Math.pow(t, 3) -1.77865 * Math.pow(t, 2) +1.97335 * t +0.189015,
			b = -4.96832 * Math.pow(t, 6) +13.3374 * Math.pow(t, 5) -12.6499 * Math.pow(t, 4) +3.52308 * Math.pow(t, 3) -0.277167 * Math.pow(t, 2) +1.71018 * t +0.0775156;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	PigeonTones: function PigeonTones(t) {
		var r = 7.70335 * Math.pow(t, 6) -27.1848 * Math.pow(t, 5) +31.7609 * Math.pow(t, 4) -14.2158 * Math.pow(t, 3) +2.20466 * Math.pow(t, 2) +0.51659 * t +0.194825,
			g = 4.95277 * Math.pow(t, 6) -19.1989 * Math.pow(t, 5) +24.5596 * Math.pow(t, 4) -12.1217 * Math.pow(t, 3) +1.86553 * Math.pow(t, 2) +0.757978 * t +0.174082,
			b = 6.73807 * Math.pow(t, 6) -25.5104 * Math.pow(t, 5) +32.2233 * Math.pow(t, 4) -15.6907 * Math.pow(t, 3) +2.30668 * Math.pow(t, 2) +0.712518 * t +0.215841;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	CherryTones: function CherryTones(t) {
		var r = 4.06784 * Math.pow(t, 6) -12.6104 * Math.pow(t, 5) +13.3719 * Math.pow(t, 4) -3.27098 * Math.pow(t, 3) -3.76012 * Math.pow(t, 2) +3.00227 * t +0.194225,
			g = -2.20942 * Math.pow(t, 6) +6.91463 * Math.pow(t, 5) -7.75299 * Math.pow(t, 4) +3.07915 * Math.pow(t, 3) +1.4122 * Math.pow(t, 2) -0.653127 * t +0.221935,
			b = -1.25616 * Math.pow(t, 6) +4.07678 * Math.pow(t, 5) -4.71344 * Math.pow(t, 4) +1.58053 * Math.pow(t, 3) +1.79035 * Math.pow(t, 2) -0.688799 * t +0.220965;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	RedBlueTones: function RedBlueTones(t) {
		var r = -9.93247 * Math.pow(t, 6) +33.6111 * Math.pow(t, 5) -38.1922 * Math.pow(t, 4) +16.98 * Math.pow(t, 3) -4.66558 * Math.pow(t, 2) +1.87789 * t +0.436982,
			g = -13.7984 * Math.pow(t, 6) +35.9279 * Math.pow(t, 5) -28.3424 * Math.pow(t, 4) +1.64421 * Math.pow(t, 3) +3.99238 * Math.pow(t, 2) +0.686152 * t +0.158917,
			b = -4.67433 * Math.pow(t, 6) +17.1922 * Math.pow(t, 5) -23.1189 * Math.pow(t, 4) +11.7884 * Math.pow(t, 3) -1.83624 * Math.pow(t, 2) +0.982552 * t +0.208944;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	CoffeeTones: function CoffeeTones(t) {
		var r = 8.19223 * Math.pow(t, 6) -25.0648 * Math.pow(t, 5) +27.8871 * Math.pow(t, 4) -12.9651 * Math.pow(t, 3) +1.45883 * Math.pow(t, 2) +1.06768 * t +0.399231,
			g = 11.7231 * Math.pow(t, 6) -35.8238 * Math.pow(t, 5) +39.0953 * Math.pow(t, 4) -16.9839 * Math.pow(t, 3) +1.77816 * Math.pow(t, 2) +0.903184 * t +0.323708,
			b = 13.0396 * Math.pow(t, 6) -41.4035 * Math.pow(t, 5) +46.5216 * Math.pow(t, 4) -19.5054 * Math.pow(t, 3) +1.45058 * Math.pow(t, 2) +0.651952 * t +0.268967;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	RustTones: function RustTones(t) {
		var r = -26.7193 * Math.pow(t, 6) +79.6745 * Math.pow(t, 5) -86.0826 * Math.pow(t, 4) +39.9912 * Math.pow(t, 3) -8.04837 * Math.pow(t, 2) +2.18855 * t -0.0169982,
			g = -12.6817 * Math.pow(t, 6) +37.8423 * Math.pow(t, 5) -41.0042 * Math.pow(t, 4) +19.1699 * Math.pow(t, 3) -3.89165 * Math.pow(t, 2) +1.03042 * t -0.00382346,
			b = 4.14985 * Math.pow(t, 6) -12.3479 * Math.pow(t, 5) +13.3061 * Math.pow(t, 4) -6.14822 * Math.pow(t, 3) +1.21717 * Math.pow(t, 2) -0.332386 * t +0.191653;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	FuchsiaTones: function FuchsiaTones(t) {
		var r = 4.16017 * Math.pow(t, 6) -11.5412 * Math.pow(t, 5) +11.6509 * Math.pow(t, 4) -5.55664 * Math.pow(t, 3) +0.90691 * Math.pow(t, 2) +1.26061 * t +0.095036,
			g = 13.466 * Math.pow(t, 6) -38.6779 * Math.pow(t, 5) +38.6712 * Math.pow(t, 4) -15.9185 * Math.pow(t, 3) +2.89948 * Math.pow(t, 2) +0.384149 * t +0.101855,
			b = 6.45398 * Math.pow(t, 6) -18.4876 * Math.pow(t, 5) +19.0572 * Math.pow(t, 4) -8.78895 * Math.pow(t, 3) +1.55249 * Math.pow(t, 2) +1.08416 * t +0.0957266;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	SiennaTones: function SiennaTones(t) {
		var r = 6.47421 * Math.pow(t, 6) -21.6967 * Math.pow(t, 5) +27.9981 * Math.pow(t, 4) -16.3298 * Math.pow(t, 3) +2.78473 * Math.pow(t, 2) +1.22453 * t +0.461351,
			g = 2.62508 * Math.pow(t, 6) -5.60781 * Math.pow(t, 5) +3.3853 * Math.pow(t, 4) -0.755243 * Math.pow(t, 3) +0.374064 * Math.pow(t, 2) +0.680209 * t +0.172608,
			b = -3.4402 * Math.pow(t, 6) +13.8795 * Math.pow(t, 5) -20.7146 * Math.pow(t, 4) +13.0065 * Math.pow(t, 3) -2.1545 * Math.pow(t, 2) +0.170309 * t +0.0687746;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	GrayTones: function GrayTones(t) {
		var r = 9.74597 * Math.pow(t, 6) -28.5857 * Math.pow(t, 5) +29.207 * Math.pow(t, 4) -11.9106 * Math.pow(t, 3) +1.82038 * Math.pow(t, 2) +0.544409 * t +0.098058,
			g = 8.24759 * Math.pow(t, 6) -24.3082 * Math.pow(t, 5) +25.1988 * Math.pow(t, 4) -10.5566 * Math.pow(t, 3) +1.58203 * Math.pow(t, 2) +0.663895 * t +0.0975947,
			b = 7.4814 * Math.pow(t, 6) -22.2387 * Math.pow(t, 5) +23.3221 * Math.pow(t, 4) -9.83429 * Math.pow(t, 3) +1.22684 * Math.pow(t, 2) +0.834721 * t +0.0946609;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	ValentineTones: function ValentineTones(t) {
		var r = 5.8158 * Math.pow(t, 6) -16.7685 * Math.pow(t, 5) +17.0397 * Math.pow(t, 4) -7.35919 * Math.pow(t, 3) +1.29836 * Math.pow(t, 2) +0.409957 * t +0.514794,
			g = 1.68093 * Math.pow(t, 6) -3.96347 * Math.pow(t, 5) +2.2983 * Math.pow(t, 4) +0.0987822 * Math.pow(t, 3) +0.440821 * Math.pow(t, 2) +0.178894 * t +0.11167,
			b = 4.00473 * Math.pow(t, 6) -10.8548 * Math.pow(t, 5) +9.70979 * Math.pow(t, 4) -3.37473 * Math.pow(t, 3) +0.955824 * Math.pow(t, 2) +0.240697 * t +0.199042;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	GrayYellowTones: function GrayYellowTones(t) {
		var r = -0.0878327 * Math.pow(t, 6) +2.16102 * Math.pow(t, 5) -4.75098 * Math.pow(t, 4) +2.19894 * Math.pow(t, 3) +0.569525 * Math.pow(t, 2) +0.655926 * t +0.177453,
			g = 0.106247 * Math.pow(t, 6) +1.32809 * Math.pow(t, 5) -3.85626 * Math.pow(t, 4) +1.61048 * Math.pow(t, 3) +0.670624 * Math.pow(t, 2) +0.653232 * t +0.210794,
			b = 1.99417 * Math.pow(t, 6) -4.93347 * Math.pow(t, 5) +3.00365 * Math.pow(t, 4) -2.1298 * Math.pow(t, 3) +1.29374 * Math.pow(t, 2) +0.679773 * t +0.291568;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	DarkTerrain: function DarkTerrain(t) {
		var r = -23.201 * Math.pow(t, 6) +67.605 * Math.pow(t, 5) -72.294 * Math.pow(t, 4) +38.1407 * Math.pow(t, 3) -12.3738 * Math.pow(t, 2) +3.17355 * t -0.0258928,
			g = -30.4784 * Math.pow(t, 6) +85.3733 * Math.pow(t, 5) -86.4526 * Math.pow(t, 4) +43.5186 * Math.pow(t, 3) -14.6358 * Math.pow(t, 2) +3.66092 * t +0.038267,
			b = -31.2044 * Math.pow(t, 6) +85.7642 * Math.pow(t, 5) -82.482 * Math.pow(t, 4) +36.3604 * Math.pow(t, 3) -8.81863 * Math.pow(t, 2) +0.976104 * t +0.452968;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	LightTerrain: function LightTerrain(t) {
		var r = -1.638 * Math.pow(t, 6) +5.38624 * Math.pow(t, 5) -5.41053 * Math.pow(t, 4) -0.00601307 * Math.pow(t, 3) +2.54355 * Math.pow(t, 2) -0.532127 * t +0.555822,
			g = -2.02577 * Math.pow(t, 6) +7.66734 * Math.pow(t, 5) -9.75081 * Math.pow(t, 4) +3.15052 * Math.pow(t, 3) +2.3767 * Math.pow(t, 2) -1.27753 * t +0.783529,
			b = -2.207 * Math.pow(t, 6) +7.22972 * Math.pow(t, 5) -8.5505 * Math.pow(t, 4) +2.56395 * Math.pow(t, 3) +3.18526 * Math.pow(t, 2) -2.16941 * t +0.857745;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	GreenBrownTerrain: function GreenBrownTerrain(t) {
		var r = -0.653349 * Math.pow(t, 6) +3.22049 * Math.pow(t, 5) +0.288525 * Math.pow(t, 4) -5.7731 * Math.pow(t, 3) +2.62123 * Math.pow(t, 2) +1.31444 * t -0.00484601,
			g = -0.0445658 * Math.pow(t, 6) -2.90732 * Math.pow(t, 5) +13.4295 * Math.pow(t, 4) -14.3069 * Math.pow(t, 3) +2.95162 * Math.pow(t, 2) +1.9305 * t -0.00742571,
			b = 2.42254 * Math.pow(t, 6) -6.06315 * Math.pow(t, 5) +7.32356 * Math.pow(t, 4) -0.478203 * Math.pow(t, 3) -4.9098 * Math.pow(t, 2) +2.75217 * t -0.0152945;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	SandyTerrain: function SandyTerrain(t) {
		var r = 11.6738 * Math.pow(t, 6) -25.3106 * Math.pow(t, 5) +19.1858 * Math.pow(t, 4) -7.58111 * Math.pow(t, 3) +0.815417 * Math.pow(t, 2) +0.867045 * t +0.65573,
			g = 15.2827 * Math.pow(t, 6) -48.4758 * Math.pow(t, 5) +62.9185 * Math.pow(t, 4) -42.0254 * Math.pow(t, 3) +12.5025 * Math.pow(t, 2) -0.160336 * t +0.329663,
			b = 0.518548 * Math.pow(t, 6) +1.72707 * Math.pow(t, 5) -4.61233 * Math.pow(t, 4) +2.99897 * Math.pow(t, 3) -1.08558 * Math.pow(t, 2) +0.452938 * t +0.203585;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	BrightBands: function BrightBands(t) {
		var r = 78.0632 * Math.pow(t, 6) -208.08 * Math.pow(t, 5) +184.513 * Math.pow(t, 4) -55.8243 * Math.pow(t, 3) +2.036 * Math.pow(t, 2) -0.662868 * t +0.959855,
			g = 24.3886 * Math.pow(t, 6) -33.4874 * Math.pow(t, 5) -8.85897 * Math.pow(t, 4) +28.2873 * Math.pow(t, 3) -13.3482 * Math.pow(t, 2) +3.7087 * t +0.107681,
			b = 205.714 * Math.pow(t, 6) -646.643 * Math.pow(t, 5) +766.461 * Math.pow(t, 4) -412.008 * Math.pow(t, 3) +89.9185 * Math.pow(t, 2) -3.19022 * t +0.298552;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	DarkBands: function DarkBands(t) {
		var r = -166.54 * Math.pow(t, 6) +470.29 * Math.pow(t, 5) -477.516 * Math.pow(t, 4) +205.061 * Math.pow(t, 3) -31.3555 * Math.pow(t, 2) +0.299734 * t +0.608799,
			g = -10.0601 * Math.pow(t, 6) +25.0166 * Math.pow(t, 5) -24.3934 * Math.pow(t, 4) +13.4027 * Math.pow(t, 3) -3.31006 * Math.pow(t, 2) -0.581105 * t +0.812262,
			b = 22.2041 * Math.pow(t, 6) -71.9994 * Math.pow(t, 5) +83.9682 * Math.pow(t, 4) -47.0744 * Math.pow(t, 3) +16.6044 * Math.pow(t, 2) -4.44064 * t +1.03914;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	Aquamarine: function Aquamarine(t) {
		var r = -0.159926 * Math.pow(t, 6) -0.737218 * Math.pow(t, 5) +2.4646 * Math.pow(t, 4) +0.346346 * Math.pow(t, 3) -2.85642 * Math.pow(t, 2) +0.948628 * t +0.679518,
			g = -0.630592 * Math.pow(t, 6) +1.19153 * Math.pow(t, 5) -0.350442 * Math.pow(t, 4) +1.15263 * Math.pow(t, 3) -2.10496 * Math.pow(t, 2) +0.746357 * t +0.725638,
			b = -0.23051 * Math.pow(t, 6) +0.0282412 * Math.pow(t, 5) +0.80611 * Math.pow(t, 4) +0.453892 * Math.pow(t, 3) -1.38889 * Math.pow(t, 2) +0.342178 * t +0.851359;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	Pastel: function Pastel(t) {
		var r = 20.5973 * Math.pow(t, 6) -56.3289 * Math.pow(t, 5) +56.4416 * Math.pow(t, 4) -26.559 * Math.pow(t, 3) +5.35322 * Math.pow(t, 2) +0.170648 * t +0.768864,
			g = -2.46306 * Math.pow(t, 6) +18.7865 * Math.pow(t, 5) -37.0723 * Math.pow(t, 4) +28.5618 * Math.pow(t, 3) -9.58511 * Math.pow(t, 2) +2.03502 * t +0.452469,
			b = -51.9143 * Math.pow(t, 6) +156.246 * Math.pow(t, 5) -184.813 * Math.pow(t, 4) +107.504 * Math.pow(t, 3) -28.9751 * Math.pow(t, 2) +1.89637 * t +0.927458;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	BlueGreenYellow: function BlueGreenYellow(t) {
		var r = -2.49442 * Math.pow(t, 6) +7.23549 * Math.pow(t, 5) -7.95799 * Math.pow(t, 4) +4.55853 * Math.pow(t, 3) -0.268394 * Math.pow(t, 2) -0.267324 * t +0.122984,
			g = 1.53105 * Math.pow(t, 6) -5.50215 * Math.pow(t, 5) +7.7363 * Math.pow(t, 4) -4.90066 * Math.pow(t, 3) +0.37891 * Math.pow(t, 2) +1.66241 * t +0.000958566,
			b = 1.16621 * Math.pow(t, 6) -4.03884 * Math.pow(t, 5) +5.44285 * Math.pow(t, 4) -2.74768 * Math.pow(t, 3) -0.702502 * Math.pow(t, 2) +0.843318 * t +0.3903;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	Rainbow: function Rainbow(t) {
		var r = 33.2244 * Math.pow(t, 6) -100.59 * Math.pow(t, 5) +115.781 * Math.pow(t, 4) -67.2886 * Math.pow(t, 3) +23.2038 * Math.pow(t, 2) -3.95569 * t +0.495532,
			g = 40.0115 * Math.pow(t, 6) -129.052 * Math.pow(t, 5) +160.522 * Math.pow(t, 4) -97.563 * Math.pow(t, 3) +27.4201 * Math.pow(t, 2) -1.35831 * t +0.120199,
			b = 32.1251 * Math.pow(t, 6) -102.898 * Math.pow(t, 5) +117.668 * Math.pow(t, 4) -52.4257 * Math.pow(t, 3) +2.94278 * Math.pow(t, 2) +2.19122 * t +0.517757;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	DarkRainbow: function DarkRainbow(t) {
		var r = 5.07049 * Math.pow(t, 6) +18.075 * Math.pow(t, 5) -63.0345 * Math.pow(t, 4) +54.481 * Math.pow(t, 3) -15.6704 * Math.pow(t, 2) +1.64207 * t +0.20735,
			g = 56.0684 * Math.pow(t, 6) -134.054 * Math.pow(t, 5) +112.24 * Math.pow(t, 4) -42.2409 * Math.pow(t, 3) +8.28114 * Math.pow(t, 2) -0.305848 * t +0.337294,
			b = -8.17643 * Math.pow(t, 6) +46.9472 * Math.pow(t, 5) -85.9868 * Math.pow(t, 4) +66.5358 * Math.pow(t, 3) -20.9741 * Math.pow(t, 2) +1.3395 * t +0.553797;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	TemperatureMap: function TemperatureMap(t) {
		var r = -4.25833 * Math.pow(t, 6) +4.44967 * Math.pow(t, 5) +11.9988 * Math.pow(t, 4) -21.8238 * Math.pow(t, 3) +9.67504 * Math.pow(t, 2) +0.550922 * t +0.192637,
			g = 9.56635 * Math.pow(t, 6) -28.444 * Math.pow(t, 5) +33.7071 * Math.pow(t, 4) -22.65 * Math.pow(t, 3) +6.69089 * Math.pow(t, 2) +0.954291 * t +0.313476,
			b = -104.058 * Math.pow(t, 6) +293.31 * Math.pow(t, 5) -296.559 * Math.pow(t, 4) +128.762 * Math.pow(t, 3) -24.036 * Math.pow(t, 2) +1.7725 * t +0.907322;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
	LightTemperatureMap: function LightTemperatureMap(t) {
		var r = -20.0442 * Math.pow(t, 6) +65.6688 * Math.pow(t, 5) -77.9412 * Math.pow(t, 4) +39.8498 * Math.pow(t, 3) -9.40352 * Math.pow(t, 2) +2.57969 * t +0.144593,
			g = 5.33604 * Math.pow(t, 6) -15.2205 * Math.pow(t, 5) +15.8374 * Math.pow(t, 4) -7.03321 * Math.pow(t, 3) -1.74562 * Math.pow(t, 2) +2.88095 * t +0.269427,
			b = -25.5455 * Math.pow(t, 6) +70.8759 * Math.pow(t, 5) -67.0611 * Math.pow(t, 4) +23.4302 * Math.pow(t, 3) -2.61616 * Math.pow(t, 2) +0.127947 * t +0.9404;
		if (r > 1) r = 1; if (g > 1) g = 1; if (b > 1) b = 1; if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
		r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);
		return "rgb(" + r + ", " + g + ", " + b + ")";
	},
}


function LoadColorFunction() {
	var t = document.getElementById("ColorFunction");
	t.innerHTML += ("<option value='_AlpineColors'>AlpineColors</option>");
	t.innerHTML += ("<option value='_LakeColors'>LakeColors</option>");
	t.innerHTML += ("<option value='_ArmyColors'>ArmyColors</option>");
	t.innerHTML += ("<option value='_MintColors'>MintColors</option>");
	t.innerHTML += ("<option value='_AtlanticColors'>AtlanticColors</option>");
	t.innerHTML += ("<option value='_NeonColors'>NeonColors</option>");
	t.innerHTML += ("<option value='_AuroraColors'>AuroraColors</option>");
	t.innerHTML += ("<option value='_PearlColors'>PearlColors</option>");
	t.innerHTML += ("<option value='_AvocadoColors'>AvocadoColors</option>");
	t.innerHTML += ("<option value='_PlumColors'>PlumColors</option>");
	t.innerHTML += ("<option value='_BeachColors'>BeachColors</option>");
	t.innerHTML += ("<option value='_RoseColors'>RoseColors</option>");
	t.innerHTML += ("<option value='_CandyColors'>CandyColors</option>");
	t.innerHTML += ("<option value='_SolarColors'>SolarColors</option>");
	t.innerHTML += ("<option value='_CMYKColors'>CMYKColors</option>");
	t.innerHTML += ("<option value='_SouthwestColors'>SouthwestColors</option>");
	t.innerHTML += ("<option value='_DeepSeaColors'>DeepSeaColors</option>");
	t.innerHTML += ("<option value='_StarryNightColors'>StarryNightColors</option>");
	t.innerHTML += ("<option value='_FallColors'>FallColors</option>");
	t.innerHTML += ("<option value='_SunsetColors'>SunsetColors</option>");
	t.innerHTML += ("<option value='_FruitPunchColors'>FruitPunchColors</option>");
	t.innerHTML += ("<option value='_ThermometerColors'>ThermometerColors</option>");
	t.innerHTML += ("<option value='_IslandColors'>IslandColors</option>");
	t.innerHTML += ("<option value='_WatermelonColors'>WatermelonColors</option>");
	t.innerHTML += ("<option value='_BrassTones'>BrassTones</option>");
	t.innerHTML += ("<option value='_GreenPinkTones'>GreenPinkTones</option>");
	t.innerHTML += ("<option value='_BrownCyanTones'>BrownCyanTones</option>");
	t.innerHTML += ("<option value='_PigeonTones'>PigeonTones</option>");
	t.innerHTML += ("<option value='_CherryTones'>CherryTones</option>");
	t.innerHTML += ("<option value='_RedBlueTones'>RedBlueTones</option>");
	t.innerHTML += ("<option value='_CoffeeTones'>CoffeeTones</option>");
	t.innerHTML += ("<option value='_RustTones'>RustTones</option>");
	t.innerHTML += ("<option value='_FuchsiaTones'>FuchsiaTones</option>");
	t.innerHTML += ("<option value='_SiennaTones'>SiennaTones</option>");
	t.innerHTML += ("<option value='_GrayTones'>GrayTones</option>");
	t.innerHTML += ("<option value='_ValentineTones'>ValentineTones</option>");
	t.innerHTML += ("<option value='_GrayYellowTones'>GrayYellowTones</option>");
	t.innerHTML += ("<option value='_DarkTerrain'>DarkTerrain</option>");
	t.innerHTML += ("<option value='_LightTerrain'>LightTerrain</option>");
	t.innerHTML += ("<option value='_GreenBrownTerrain'>GreenBrownTerrain</option>");
	t.innerHTML += ("<option value='_SandyTerrain'>SandyTerrain</option>");
	t.innerHTML += ("<option value='_BrightBands'>BrightBands</option>");
	t.innerHTML += ("<option value='_DarkBands'>DarkBands</option>");
	t.innerHTML += ("<option value='_Aquamarine'>Aquamarine</option>");
	t.innerHTML += ("<option value='_Pastel'>Pastel</option>");
	t.innerHTML += ("<option value='_BlueGreenYellow'>BlueGreenYellow</option>");
	t.innerHTML += ("<option value='_Rainbow'>Rainbow</option>");
	t.innerHTML += ("<option value='_DarkRainbow'>DarkRainbow</option>");
	t.innerHTML += ("<option value='_TemperatureMap'>TemperatureMap</option>");
	t.innerHTML += ("<option value='_LightTemperatureMap'>LightTemperatureMap</option>");
}


function MtColor(t) {
	switch (colorfv) {
		case "_AlpineColors": return ColorFunction.AlpineColors(t); break;
		case "_LakeColors": return ColorFunction.LakeColors(t); break;
		case "_ArmyColors": return ColorFunction.ArmyColors(t); break;
		case "_MintColors": return ColorFunction.MintColors(t); break;
		case "_AtlanticColors": return ColorFunction.AtlanticColors(t); break;
		case "_NeonColors": return ColorFunction.NeonColors(t); break;
		case "_AuroraColors": return ColorFunction.AuroraColors(t); break;
		case "_PearlColors": return ColorFunction.PearlColors(t); break;
		case "_AvocadoColors": return ColorFunction.AvocadoColors(t); break;
		case "_PlumColors": return ColorFunction.PlumColors(t); break;
		case "_BeachColors": return ColorFunction.BeachColors(t); break;
		case "_RoseColors": return ColorFunction.RoseColors(t); break;
		case "_CandyColors": return ColorFunction.CandyColors(t); break;
		case "_SolarColors": return ColorFunction.SolarColors(t); break;
		case "_CMYKColors": return ColorFunction.CMYKColors(t); break;
		case "_SouthwestColors": return ColorFunction.SouthwestColors(t); break;
		case "_DeepSeaColors": return ColorFunction.DeepSeaColors(t); break;
		case "_StarryNightColors": return ColorFunction.StarryNightColors(t); break;
		case "_FallColors": return ColorFunction.FallColors(t); break;
		case "_SunsetColors": return ColorFunction.SunsetColors(t); break;
		case "_FruitPunchColors": return ColorFunction.FruitPunchColors(t); break;
		case "_ThermometerColors": return ColorFunction.ThermometerColors(t); break;
		case "_IslandColors": return ColorFunction.IslandColors(t); break;
		case "_WatermelonColors": return ColorFunction.WatermelonColors(t); break;
		case "_BrassTones": return ColorFunction.BrassTones(t); break;
		case "_GreenPinkTones": return ColorFunction.GreenPinkTones(t); break;
		case "_BrownCyanTones": return ColorFunction.BrownCyanTones(t); break;
		case "_PigeonTones": return ColorFunction.PigeonTones(t); break;
		case "_CherryTones": return ColorFunction.CherryTones(t); break;
		case "_RedBlueTones": return ColorFunction.RedBlueTones(t); break;
		case "_CoffeeTones": return ColorFunction.CoffeeTones(t); break;
		case "_RustTones": return ColorFunction.RustTones(t); break;
		case "_FuchsiaTones": return ColorFunction.FuchsiaTones(t); break;
		case "_SiennaTones": return ColorFunction.SiennaTones(t); break;
		case "_GrayTones": return ColorFunction.GrayTones(t); break;
		case "_ValentineTones": return ColorFunction.ValentineTones(t); break;
		case "_GrayYellowTones": return ColorFunction.GrayYellowTones(t); break;
		case "_DarkTerrain": return ColorFunction.DarkTerrain(t); break;
		case "_LightTerrain": return ColorFunction.LightTerrain(t); break;
		case "_GreenBrownTerrain": return ColorFunction.GreenBrownTerrain(t); break;
		case "_SandyTerrain": return ColorFunction.SandyTerrain(t); break;
		case "_BrightBands": return ColorFunction.BrightBands(t); break;
		case "_DarkBands": return ColorFunction.DarkBands(t); break;
		case "_Aquamarine": return ColorFunction.Aquamarine(t); break;
		case "_Pastel": return ColorFunction.Pastel(t); break;
		case "_BlueGreenYellow": return ColorFunction.BlueGreenYellow(t); break;
		case "_Rainbow": return ColorFunction.Rainbow(t); break;
		case "_DarkRainbow": return ColorFunction.DarkRainbow(t); break;
		case "_TemperatureMap": return ColorFunction.TemperatureMap(t); break;
		case "_LightTemperatureMap": return ColorFunction.LightTemperatureMap(t); break;
		default: throw "Invalid Color Function \"" + colorfv + "\"";
	}
}


