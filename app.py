import os
import sys
import webbrowser
from threading import Timer
from flask import Flask, render_template, request, jsonify

if getattr(sys, 'frozen', False):
    template_folder = os.path.join(sys._MEIPASS, 'templates')
    app = Flask(__name__, template_folder=template_folder)
else:
    app = Flask(__name__)

RATES = {
    "BASE_BOX": 60.00,
    "WALL_BOX": 46.00,
    "DRAWER_BOX": 150.00,
    "BLUM_SLIDE": 40.00,
    "SLAB_DOOR_BASE": 21.25,
    "SLAB_DOOR_WALL": 25.50,
    "THERMO_DOOR_BASE": 42.50,
    "THERMO_DOOR_WALL": 51.00,
    "PAINT_DOOR_BASE": 57.50,
    "PAINT_DOOR_WALL": 69.00,
    "SLAB_PANEL_BASE": 37.50,
    "SLAB_PANEL_WALL": 19.50,
    "THERMO_PANEL_BASE": 71.88,
    "THERMO_PANEL_WALL": 37.38,
    "PAINT_PANEL_BASE": 115.63,
    "PAINT_PANEL_WALL": 60.13,
    "SLAB_SQFT": 6.00,
    "THERMO_SQFT": 11.50,
    "PAINT_SQFT": 18.50,
    "TOE_KICK": {"slab": 25.00, "thermo": 40.00, "paint": 65.00},
    "MARKUP": 1.45,
    "DELIVERY": 200.00,
    "INSTALL_PER_BOX": 75.00
}

@app.route("/")
def index():
    return render_template("estimator.html")

@app.route("/api/calculate", methods=["POST"])
def calculate():
    try:
        data = request.json or {}
        
        wall1 = float(data.get("wall1") or 0)
        wall2 = float(data.get("wall2") or 0)
        wall3 = float(data.get("wall3") or 0)
        
        fridges = int(data.get("fridges") or 0)
        stoves = int(data.get("stoves") or 0)
        dishwashers = int(data.get("dishwashers") or 0)
        hoods = int(data.get("hoods") or 0)
        windows = int(data.get("windows") or 0)
        
        base_corners = int(data.get("base_corners") or 0)
        wall_corners = int(data.get("wall_corners") or 0)
        
        drawers = int(data.get("drawers") or 0)
        slides = int(data.get("slides") or 0)
        base_panels = int(data.get("base_panels") or 0)
        wall_panels = int(data.get("wall_panels") or 0)
        box_count = int(data.get("box_count") or 0)
        
        gross_lf = (wall1 + wall2 + wall3) / 12.0
        net_base_lf = max(0.0, gross_lf - (fridges * 3.0) - (stoves * 2.5) - (dishwashers * 2.0) - (base_corners * 2.0))
        net_wall_lf = max(0.0, gross_lf - (fridges * 3.0) - (hoods * 2.5) - (windows * 3.0) - (wall_corners * 1.0))
        
        fixed_cost = (net_base_lf * RATES["BASE_BOX"]) + (net_wall_lf * RATES["WALL_BOX"]) + (drawers * RATES["DRAWER_BOX"]) + (slides * RATES["BLUM_SLIDE"])
        
        side_filler_sqft = 2.0 * (4.0 * 30.0 / 144.0)
        ceiling_filler_sqft = 6.0 * (net_wall_lf * 12.0) / 144.0
        total_filler_sqft = side_filler_sqft + ceiling_filler_sqft
        
        toe_kick_strips = int(net_base_lf // 8) + (1 if net_base_lf % 8 > 0 else 0)
        site_services = RATES["DELIVERY"] + (box_count * RATES["INSTALL_PER_BOX"])
        
        slab_mat = fixed_cost + (net_base_lf * RATES["SLAB_DOOR_BASE"]) + (net_wall_lf * RATES["SLAB_DOOR_WALL"]) + (base_panels * RATES["SLAB_PANEL_BASE"]) + (wall_panels * RATES["SLAB_PANEL_WALL"]) + (total_filler_sqft * RATES["SLAB_SQFT"]) + (toe_kick_strips * RATES["TOE_KICK"]["slab"])
        thermo_mat = fixed_cost + (net_base_lf * RATES["THERMO_DOOR_BASE"]) + (net_wall_lf * RATES["THERMO_DOOR_WALL"]) + (base_panels * RATES["THERMO_PANEL_BASE"]) + (wall_panels * RATES["THERMO_PANEL_WALL"]) + (total_filler_sqft * RATES["THERMO_SQFT"]) + (toe_kick_strips * RATES["TOE_KICK"]["thermo"])
        paint_mat = fixed_cost + (net_base_lf * RATES["PAINT_DOOR_BASE"]) + (net_wall_lf * RATES["PAINT_DOOR_WALL"]) + (base_panels * RATES["PAINT_PANEL_BASE"]) + (wall_panels * RATES["PAINT_PANEL_WALL"]) + (total_filler_sqft * RATES["PAINT_SQFT"]) + (toe_kick_strips * RATES["TOE_KICK"]["paint"])
        
        return jsonify({
            "status": "success",
            "net_base_lf": round(net_base_lf, 2),
            "net_wall_lf": round(net_wall_lf, 2),
            "slab_quote": round((slab_mat * RATES["MARKUP"]) + site_services, 2),
            "thermo_quote": round((thermo_mat * RATES["MARKUP"]) + site_services, 2),
            "paint_quote": round((paint_mat * RATES["MARKUP"]) + site_services, 2)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

def open_browser():
    webbrowser.open_new("http://127.0.0.1:8000/")

if __name__ == "__main__":
    Timer(1.0, open_browser).start()
    app.run(host="0.0.0.0", port=8000, debug=False)