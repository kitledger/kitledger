-- Custom SQL migration file, put you code below! ---- Custom SQL migration file, put you code below!

-- Add a trigger to check if the UOM conversion rate is greater than or equal to zero
CREATE OR REPLACE FUNCTION check_conversion_rate_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rate < 0 THEN
        RAISE EXCEPTION 'Rate must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_conversion_rate_negative_values_trigger'
    ) THEN
        CREATE TRIGGER check_conversion_rate_negative_values_trigger
        BEFORE INSERT OR UPDATE ON conversion_rates
        FOR EACH ROW
        EXECUTE PROCEDURE check_conversion_rate_negative_values();
    END IF;
END;
$$;

-- Add a trigger to check if the value and quantity are greater than or equal to zero
CREATE OR REPLACE FUNCTION check_entry_negative_values() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.value < 0 THEN
        RAISE EXCEPTION 'Value must be greater than or equal to zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'check_entry_negative_values_trigger'
    ) THEN
        CREATE TRIGGER check_entry_negative_values_trigger
        BEFORE INSERT OR UPDATE ON entries
        FOR EACH ROW
        EXECUTE PROCEDURE check_entry_negative_values();
    END IF;
END;
$$;