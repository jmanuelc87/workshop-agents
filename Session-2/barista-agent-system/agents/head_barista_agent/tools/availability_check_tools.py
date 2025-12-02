import logging


def check_availability_coffee(datetime: str) -> list[str]:
    """
    Checks the availability of coffee types based on the provided datetime.

    Args:
        datetime (str): The datetime in "HH:MM" format (military time).

    Returns:
        list[str]: A list of available coffee types for the given time.
    """
    try:
        # Create a dictionary where the key is the military time and the value is the type of coffee based on this information RULES
        availability_coffee_type = {
            # --- Morning (Hot Drinks & Classics) ---
            "08:00": [
                "Mocha Magic", "Vanilla Dream", "Espresso Elixir", "Latte Lux",
                "Cappuccino Charm", "Flat White Velvet"
            ],
            "09:00": [
                "Mocha Magic", "Vanilla Dream", "Espresso Elixir", "Latte Lux",
                "Cappuccino Charm", "Flat White Velvet", "Matcha Zen"
            ],
            "10:00": [
                "Caramel Delight", "Hazelnut Harmony", "Latte Lux", "Americano Bold",
                "Chai Spice Serenity", "Matcha Zen"
            ],
            "11:00": [
                "Caramel Delight", "Honey Lavender Haze", "Espresso Elixir", "Cortado Cut",
                "Flat White Velvet", "Golden Turmeric Glow"
            ],

            # --- Noon (Shift to Cold Drinks & Alternatives) ---
            "12:00": [
                "Vanilla Dream", "Hazelnut Harmony", "Cold Brew Breeze", "Iced Caramel Cloud",
                "Matcha Zen", "Chai Spice Serenity"
            ],
            "13:00": [
                "Vanilla Dream", "Hazelnut Harmony", "Cold Brew Breeze", "Iced Caramel Cloud",
                "Flat White Velvet", "Americano Bold",
                # NOTE: Affogato Bliss and Nitro Noir are intentionally excluded for testing 'Sold Out' logic.
            ],

            # --- Afternoon (Desserts and Limited Stock) ---
            "14:00": [
                "Vanilla Dream", "Cold Brew Breeze", "Latte Lux", "Cortado Cut",
                "Golden Turmeric Glow"
            ],
            "15:00": [
                "Mocha Magic", "Caramel Delight", "Iced Caramel Cloud", "Chai Spice Serenity"
            ],

            # --- Late Afternoon (Return to Classics) ---
            "16:00": [
                "Caramel Delight", "Espresso Elixir", "Latte Lux", "Cappuccino Charm",
                "Flat White Velvet"
            ],
            "17:00": [
                "Caramel Delight", "Honey Lavender Haze", "Americano Bold", "Cortado Cut"
            ],
            "18:00": [
                "Caramel Delight", "Mocha Magic", "Hazelnut Harmony", "Matcha Zen"
            ],

            # --- Evening (Limited Stock and Specials) ---
            "19:00": [
                "Mocha Magic", "Vanilla Dream", "Hazelnut Harmony", "Espresso Elixir",
                "Chai Spice Serenity"
            ],
            "20:00": [
                "Caramel Delight", "Mocha Magic", "Latte Lux", "Golden Turmeric Glow"
            ],
        }

        logging.info(f"Checking availability for {datetime}")

        hour = datetime.split(":")[0]
        hour_key = hour + ":00"

        if hour_key in availability_coffee_type:
            logging.info(
                f"Availability for {hour_key}: {availability_coffee_type[hour_key]}"
            )
            return availability_coffee_type[hour_key]

        return []

    except Exception as e:
        logging.error(f"An error occurred in check_availability_coffee: {e}")
        return []
