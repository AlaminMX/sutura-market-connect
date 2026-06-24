
-- 1. products.price_updated_at + trigger
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_updated_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.products ALTER COLUMN price DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.stamp_price_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.price IS NOT NULL) THEN
    NEW.price_updated_at = now();
  ELSIF (TG_OP = 'UPDATE' AND NEW.price IS DISTINCT FROM OLD.price) THEN
    NEW.price_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stamp_price_updated_at_trg ON public.products;
CREATE TRIGGER stamp_price_updated_at_trg
BEFORE INSERT OR UPDATE OF price ON public.products
FOR EACH ROW EXECUTE FUNCTION public.stamp_price_updated_at();

-- 2. whatsapp_clicks indexes
CREATE INDEX IF NOT EXISTS whatsapp_clicks_seller_created_idx
  ON public.whatsapp_clicks (seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS whatsapp_clicks_product_idx
  ON public.whatsapp_clicks (product_id);

-- 3. sellers WhatsApp number CHECK (NOT VALID to skip existing rows)
ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_whatsapp_number_format;
ALTER TABLE public.sellers
  ADD CONSTRAINT sellers_whatsapp_number_format
  CHECK (whatsapp_number ~ '^0[789][0-9]{9}$') NOT VALID;

-- 4. homepage_sections bilingual columns
ALTER TABLE public.homepage_sections
  ADD COLUMN IF NOT EXISTS title_en TEXT,
  ADD COLUMN IF NOT EXISTS title_ha TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS subtitle_ha TEXT,
  ADD COLUMN IF NOT EXISTS body_en TEXT,
  ADD COLUMN IF NOT EXISTS body_ha TEXT;

-- backfill from legacy single-language columns
UPDATE public.homepage_sections
SET title_en = COALESCE(title_en, title),
    subtitle_en = COALESCE(subtitle_en, subtitle),
    body_en = COALESCE(body_en, content)
WHERE title_en IS NULL OR subtitle_en IS NULL OR body_en IS NULL;

-- 5. Vouch threshold 5 -> 3
CREATE OR REPLACE FUNCTION public.check_vouch_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  verified_vouch_count INT;
BEGIN
  SELECT COUNT(*) INTO verified_vouch_count
  FROM public.vouches v
  JOIN public.sellers s ON s.id = v.voucher_seller_id
  WHERE v.vouched_seller_id = NEW.vouched_seller_id
    AND s.is_verified = true;

  IF verified_vouch_count >= 3 THEN
    UPDATE public.sellers SET is_verified = true WHERE id = NEW.vouched_seller_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_vouch_revocation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  verified_vouch_count INT;
BEGIN
  SELECT COUNT(*) INTO verified_vouch_count
  FROM public.vouches v
  JOIN public.sellers s ON s.id = v.voucher_seller_id
  WHERE v.vouched_seller_id = OLD.vouched_seller_id
    AND s.is_verified = true;

  IF verified_vouch_count < 3 THEN
    UPDATE public.sellers SET is_verified = false
    WHERE id = OLD.vouched_seller_id
      AND is_verified = true;
  END IF;
  RETURN OLD;
END;
$$;
