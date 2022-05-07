RES = 360
COLORS = [
    "#fd004c",
    "#fe9000",
    "#fff020",
    "#3edf4b",
    "#3363ff",
    "#b102b7",
    "#fd004c",
]

with open("server/interface/timer_popup/rgb.css", "w") as f:
    step = (360/RES)
    
    f.write("@keyframes rgb {\n")

    for i in range(RES + 1):
        deg = round(i * step, 3)
        per = round(deg / RES * 100, 3)
        f.write(f"\t{per:>6}% {{ background: conic-gradient(")

        s = f"from {str(deg):>4}deg, "
        for color in COLORS:
            s += f"{color}, "            
        s = s[:-2]

        f.write(f"{s}) }}\n")

    f.write("}\n")