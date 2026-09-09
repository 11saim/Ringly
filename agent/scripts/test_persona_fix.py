"""Test persona.py fixes: null markers and handling section."""
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.agent.persona import build_system_prompt

sb = get_client()

# Test with Product-type tenant (Turbo)
product_tenant_id = "b14060b1-d89c-4455-99a3-0be2e1f0cdac"
print("=" * 60)
print("PRODUCT TENANT (Turbo) - System Prompt Excerpt")
print("=" * 60)
prompt = build_system_prompt(product_tenant_id, is_first_message=True)

# Show the "About this business" section and handling section
lines = prompt.split("\n")
in_about = False
in_handling = False
for line in lines:
    if "About this business:" in line:
        in_about = True
    if in_about:
        print(line)
        if line.startswith("- ") and "Use this business" in line:
            in_about = False
            print()
    if "HANDLING REQUESTS" in line:
        in_handling = True
    if in_handling:
        print(line)
        if "conversation forward." in line:
            in_handling = False
            print()

# Test with Service-type tenant (Tokyo Salon)
service_tenant_id = "e0f31abc-8acf-4c8f-9d81-5f849a53af9b"
print("\n" + "=" * 60)
print("SERVICE TENANT (Tokyo Salon) - System Prompt Excerpt")
print("=" * 60)
prompt = build_system_prompt(service_tenant_id, is_first_message=True)

lines = prompt.split("\n")
in_about = False
in_handling = False
for line in lines:
    if "About this business:" in line:
        in_about = True
    if in_about:
        print(line)
        if line.startswith("- ") and "Use this business" in line:
            in_about = False
            print()
    if "HANDLING REQUESTS" in line:
        in_handling = True
    if in_handling:
        print(line)
        if "conversation forward." in line:
            in_handling = False
            print()

print("\n=== PERSONA PROMPT TEST DONE ===")
