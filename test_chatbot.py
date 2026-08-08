import traceback

from backend.routers.chatbot import ChatMessage, ChatRequest, chat_with_farmer

print("Testing simple intent parsing (Healthy Corn)...")
request_healthy = ChatRequest(
    message="I planted some corn about a month ago. I water it everyday with one mug. The leaves look fine.",
    disease_class="Corn___healthy"
)
try:
    response_healthy = chat_with_farmer(request_healthy)
    print("\n--- Response for Healthy Corn ---")
    print("Simple Advice Generated (English):")
    print(response_healthy.simple_advice)
    print("---------------------------------\n")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()


print("Testing Hindi Output (Sick Tomato)...")
request_sick = ChatRequest(
    message="pls help. tomato have white powder. yesterday give urea. water 2 liter.",
    disease_class="Tomato___Late_blight",
    language="Hindi"
)
try:
    response_sick = chat_with_farmer(request_sick)
    print("\n--- Response for Sick Tomato (Hindi) ---")
    print("Simple Advice Generated:")
    print(response_sick.simple_advice)
    print("---------------------------------\n")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()


print("Testing Conversation History (Farmer corrects watering amount)...")
history = [
    ChatMessage(role="user", content="I watered my potatoes 10 liters yesterday."),
    ChatMessage(role="assistant", content="That is a lot of water. Do you have any diseases?"),
]
request_history = ChatRequest(
    message="Sorry, I meant 1 liter. They are healthy.",
    disease_class="Potato___healthy",
    history=history
)
try:
    response_history = chat_with_farmer(request_history)
    print("\n--- Response for History test ---")
    # Should pick up 1 liter instead of 10 liters. We can check the generated json
    print(f"Parsed water liters: {response_history.irrigation_plan[0].action}")
    print("Simple Advice Generated:")
    print(response_history.simple_advice)
    print("---------------------------------\n")
except Exception as e:
    print(f"Error: {e}")
    traceback.print_exc()
