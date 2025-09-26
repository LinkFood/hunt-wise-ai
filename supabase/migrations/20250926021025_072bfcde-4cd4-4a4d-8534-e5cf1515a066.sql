-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_premium BOOLEAN DEFAULT false
);

-- Create trophies table
CREATE TABLE public.trophies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zip_code VARCHAR(5) NOT NULL,
  species TEXT NOT NULL,
  kill_date DATE NOT NULL,
  photo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clubs_leases table
CREATE TABLE public.clubs_leases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  cost_estimate DECIMAL(10,2),
  is_verified BOOLEAN DEFAULT false,
  join_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_posts table
CREATE TABLE public.chat_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zip_code VARCHAR(5) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '90 days')
);

-- Create join_requests table
CREATE TABLE public.join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.clubs_leases(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trophies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for trophies (user-only access)
CREATE POLICY "Users can view their own trophies" 
ON public.trophies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trophies" 
ON public.trophies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trophies" 
ON public.trophies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trophies" 
ON public.trophies 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for clubs_leases (public read, authenticated write)
CREATE POLICY "Anyone can view clubs and leases" 
ON public.clubs_leases 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create clubs and leases" 
ON public.clubs_leases 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update clubs and leases" 
ON public.clubs_leases 
FOR UPDATE 
TO authenticated 
USING (true);

-- RLS Policies for chat_posts (read all, authenticated write)
CREATE POLICY "Anyone can view chat posts" 
ON public.chat_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create chat posts" 
ON public.chat_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat posts" 
ON public.chat_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat posts" 
ON public.chat_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for join_requests
CREATE POLICY "Users can view their own join requests" 
ON public.join_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own join requests" 
ON public.join_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for trophy photos
INSERT INTO storage.buckets (id, name, public) VALUES ('trophy_photos', 'trophy_photos', false);

-- Storage policies for trophy photos (user-only access)
CREATE POLICY "Users can view their own trophy photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'trophy_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own trophy photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'trophy_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own trophy photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'trophy_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own trophy photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'trophy_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();