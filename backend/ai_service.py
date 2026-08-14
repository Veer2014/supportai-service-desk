import os
import pandas as pd


# Path to our support-ticket dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "tickets.csv")


def load_tickets():
    """
    Load the support ticket dataset.
    """
    try:
        return pd.read_csv(DATASET_PATH)
    except Exception as e:
        print(f"Could not load dataset: {e}")
        return pd.DataFrame()


def analyze_incident(title, description, priority):
    """
    Analyze an incident using patterns from the support-ticket dataset.

    This is a local rule/pattern-based analysis system,
    so it does not require an external AI API.
    """

    df = load_tickets()

    text = f"{title} {description}".lower()

    # -----------------------------------------
    # 1. Detect category/service
    # -----------------------------------------

    if any(word in text for word in [
        "login", "password", "authentication",
        "account", "sign in", "signin", "access"
    ]):
        category = "Authentication / Identity"
        possible_cause = (
            "The issue may be related to authentication, "
            "user credentials, access configuration, or a recent deployment."
        )
        recommended_actions = [
            "Check authentication service logs.",
            "Verify recent deployment changes.",
            "Check user/account configuration.",
            "Verify database connectivity for authentication.",
        ]

    elif any(word in text for word in [
        "network", "internet", "wifi", "connection",
        "vpn", "latency", "dns"
    ]):
        category = "Network"
        possible_cause = (
            "The issue may be related to network connectivity, "
            "DNS, VPN, or infrastructure configuration."
        )
        recommended_actions = [
            "Check network connectivity.",
            "Verify DNS and VPN configuration.",
            "Check infrastructure/network logs.",
            "Test whether the issue affects multiple users.",
        ]

    elif any(word in text for word in [
        "database", "sql", "query", "db", "data"
    ]):
        category = "Database"
        possible_cause = (
            "The issue may be related to database connectivity, "
            "queries, configuration, or database availability."
        )
        recommended_actions = [
            "Check database connectivity.",
            "Review database/server logs.",
            "Check recent schema or configuration changes.",
            "Verify database performance and availability.",
        ]

    elif any(word in text for word in [
        "email", "mail", "outlook", "gmail"
    ]):
        category = "Email / Collaboration"
        possible_cause = (
            "The issue may be related to email configuration, "
            "service availability, or account settings."
        )
        recommended_actions = [
            "Check email service availability.",
            "Verify account configuration.",
            "Check mail server logs.",
            "Test with another user account.",
        ]

    elif any(word in text for word in [
        "printer", "printing", "scanner", "keyboard",
        "mouse", "webcam", "laptop", "computer", "device"
    ]):
        category = "Hardware / Device"
        possible_cause = (
            "The issue may be related to device configuration, "
            "drivers, connectivity, or hardware availability."
        )
        recommended_actions = [
            "Check device connectivity.",
            "Verify drivers and device configuration.",
            "Test the device on another machine if possible.",
            "Check whether the issue affects other users.",
        ]

    elif any(word in text for word in [
        "server", "deployment", "api", "500",
        "502", "503", "service", "application"
    ]):
        category = "Application / Service"
        possible_cause = (
            "The issue may be related to an application service, "
            "recent deployment, API failure, or backend configuration."
        )
        recommended_actions = [
            "Check application and API logs.",
            "Review the latest deployment changes.",
            "Verify backend service availability.",
            "Consider rolling back the latest deployment if necessary.",
        ]

    else:
        category = "General Technical Issue"
        possible_cause = (
            "The available information is insufficient to determine "
            "a specific technical cause."
        )
        recommended_actions = [
            "Collect additional information from the user.",
            "Check application and system logs.",
            "Identify whether other users are affected.",
            "Review recent system changes.",
        ]

    # -----------------------------------------
    # 2. Suggested priority
    # -----------------------------------------

    suggested_priority = priority

    if any(word in text for word in [
        "critical", "outage", "down", "all users",
        "everyone", "production down"
    ]):
        suggested_priority = "Critical"

    elif any(word in text for word in [
        "500", "502", "503", "unable to login",
        "cannot login", "can't login"
    ]):
        suggested_priority = "High"

    # -----------------------------------------
    # 3. Dataset statistics
    # -----------------------------------------

    dataset_context = None

    if not df.empty:
        dataset_context = {
            "tickets_analyzed": len(df),
            "common_priorities": (
                df["priority"]
                .value_counts()
                .head(3)
                .to_dict()
            ),
        }

    # -----------------------------------------
    # 4. Return structured analysis
    # -----------------------------------------

    return {
        "category": category,
        "possible_cause": possible_cause,
        "recommended_actions": recommended_actions,
        "suggested_priority": suggested_priority,
        "dataset_context": dataset_context,
    }