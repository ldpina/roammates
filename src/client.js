import { createClient } from '@supabase/supabase-js'

const URL = 'https://xymmyufwlhkgtbdwvgea.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bW15dWZ3bGhrZ3RiZHd2Z2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NTEyNjcsImV4cCI6MjA0NzUyNzI2N30.ZR26xaKjNi0NzmUrlLQX9V5dX6oQ2KnUWsQkzP85Mk4';


export const supabase = createClient(URL, API_KEY);