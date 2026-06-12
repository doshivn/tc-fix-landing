-- Chạy mã SQL này trong phần SQL Editor của Supabase
-- Để tạo bảng lưu trữ dữ liệu đặt dịch vụ (bookings)

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Row Level Security (RLS) để bảo mật
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Cho phép gửi dữ liệu mới vào từ website (Ai cũng có thể thêm)
CREATE POLICY "Allow public inserts" ON public.bookings
    FOR INSERT
    WITH CHECK (true);

-- (Tuỳ chọn) Nếu bạn muốn tự xem lại dữ liệu trên trang quản trị,
-- Supabase Studio đã tự động cho phép tài khoản chủ xem, nhưng nếu bạn
-- tạo trang Admin bằng mã riêng, bạn sẽ cần thêm Policy cho SELECT.
