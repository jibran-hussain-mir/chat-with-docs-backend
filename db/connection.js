import 'dotenv/config';
import { createClient } from '@supabase/supabase-js'

const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL;
const serviceRoleKey = process.env.SUPABASE_PROJECT_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseProjectUrl, serviceRoleKey);

export default supabase;