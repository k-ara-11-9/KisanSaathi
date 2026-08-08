import json
import os

BASE_DIR = r"n:\SARANYA\GITRepositories\WEBSITES\KisanSaathi-main\backend\data"
CROPS_FILE = os.path.join(BASE_DIR, "crops.json")
DISEASE_RULES_FILE = os.path.join(BASE_DIR, "fertilizer_rules.json")

# 1. Expand crops.json
crops = {
    "tomato": {
        "seedling": {"nitrogen": 40.0, "phosphorus": 30.0, "potassium": 30.0, "moisture": 60.0},
        "vegetative": {"nitrogen": 80.0, "phosphorus": 40.0, "potassium": 60.0, "moisture": 65.0},
        "flowering": {"nitrogen": 70.0, "phosphorus": 60.0, "potassium": 90.0, "moisture": 70.0},
        "fruiting": {"nitrogen": 60.0, "phosphorus": 50.0, "potassium": 110.0, "moisture": 70.0}
    },
    "rice": {
        "tillering": {"nitrogen": 90.0, "phosphorus": 40.0, "potassium": 40.0, "moisture": 80.0},
        "panicle_initiation": {"nitrogen": 110.0, "phosphorus": 50.0, "potassium": 60.0, "moisture": 85.0},
        "flowering": {"nitrogen": 80.0, "phosphorus": 30.0, "potassium": 50.0, "moisture": 85.0}
    }
}

new_crops = [
    "apple", "blueberry", "cherry", "corn", "grape", "orange", "peach", 
    "pepper,_bell", "potato", "raspberry", "soybean", "squash", "strawberry"
]

for crop in new_crops:
    crops[crop] = {
        "vegetative": {"nitrogen": 60.0, "phosphorus": 40.0, "potassium": 50.0, "moisture": 60.0},
        "fruiting": {"nitrogen": 50.0, "phosphorus": 50.0, "potassium": 80.0, "moisture": 65.0}
    }

with open(CROPS_FILE, 'w') as f:
    json.dump(crops, f, indent=4)


# 2. Expand fertilizer_rules.json
rules = {
    "early_blight": {
        "nitrogen_multiplier": 0.8,
        "irrigation_override": "avoid_overwatering",
        "water_multiplier": 0.8,
        "advice": "Reduce nitrogen by 20% to prevent excessive leafy growth which encourages early blight lesion spread. Avoid overwatering as prolonged leaf wetness promotes disease development."
    },
    "late_blight": {
        "nitrogen_multiplier": 0.7,
        "irrigation_override": "delay",
        "water_multiplier": 0.7,
        "advice": "Reduce nitrogen by 30% and delay irrigation significantly. Late blight thrives in wet, humid conditions; maintaining dry foliage is critical."
    },
    "leaf_curl": {
        "nitrogen_multiplier": 1.2,
        "irrigation_override": "irrigate",
        "water_multiplier": 1.1,
        "advice": "Increase nitrogen by 20% and maintain consistent moisture. Leaf curl virus stresses the plant, requiring slightly higher nutrient support and prevention of drought stress."
    }
}

# The new ML classes format: Crop___Disease
classes = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Background_without_leaves", "Blueberry___healthy", "Cherry___Powdery_mildew", "Cherry___healthy",
    "Corn___Cercospora_leaf_spot Gray_leaf_spot", "Corn___Common_rust", "Corn___Northern_Leaf_Blight", "Corn___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy", "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy",
    "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

for cls in classes:
    cls_lower = cls.lower()
    if "healthy" in cls_lower or "background" in cls_lower:
        # Healthy plants get no overrides
        continue
    
    if "early_blight" in cls_lower:
        rules[cls_lower] = rules["early_blight"]
    elif "late_blight" in cls_lower:
        rules[cls_lower] = rules["late_blight"]
    elif "curl" in cls_lower:
        rules[cls_lower] = rules["leaf_curl"]
    elif "rust" in cls_lower or "scab" in cls_lower or "rot" in cls_lower or "mold" in cls_lower or "mildew" in cls_lower or "spot" in cls_lower or "blight" in cls_lower:
        # Generic fungal logic
        rules[cls_lower] = {
            "nitrogen_multiplier": 0.85,
            "irrigation_override": "delay",
            "water_multiplier": 0.85,
            "advice": "Fungal/Bacterial issue detected. Reduce nitrogen to slow leafy growth and reduce irrigation to lower humidity around the plant."
        }
    else:
        # Generic other logic (viruses, mites)
        rules[cls_lower] = {
            "nitrogen_multiplier": 1.1,
            "irrigation_override": "irrigate",
            "water_multiplier": 1.0,
            "advice": "Plant is stressed by pests or virus. Maintain strong nutrition (slight nitrogen boost) and avoid drought stress."
        }

with open(DISEASE_RULES_FILE, 'w') as f:
    json.dump(rules, f, indent=4)

print("Successfully updated crops.json and fertilizer_rules.json")
