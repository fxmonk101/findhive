CREATE TABLE public.site_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  topic text NOT NULL DEFAULT 'support',
  rating integer NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_reviews ADD CONSTRAINT site_reviews_topic_check
  CHECK (topic IN ('support','shipping','reliability','experience'));
ALTER TABLE public.site_reviews ADD CONSTRAINT site_reviews_status_check
  CHECK (status IN ('pending','approved','rejected'));
ALTER TABLE public.site_reviews ADD CONSTRAINT site_reviews_rating_check
  CHECK (rating BETWEEN 1 AND 5);

GRANT SELECT, INSERT ON public.site_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_reviews TO authenticated;
GRANT ALL ON public.site_reviews TO service_role;
ALTER TABLE public.site_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved store reviews are publicly readable" ON public.site_reviews
  FOR SELECT USING (status = 'approved' OR public.is_admin(auth.uid()));
CREATE POLICY "Anyone can submit a store review" ON public.site_reviews
  FOR INSERT WITH CHECK (
    length(btrim(author_name)) BETWEEN 2 AND 60
    AND length(btrim(title)) BETWEEN 3 AND 100
    AND length(btrim(body)) BETWEEN 10 AND 2000
  );
CREATE POLICY "Admins manage store reviews" ON public.site_reviews
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER site_reviews_set_updated_at BEFORE UPDATE ON public.site_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();