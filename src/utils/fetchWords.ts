import type { SupabaseClient } from "@supabase/supabase-js";

export interface WordOptions {
    minLength: number;
    maxLength: number;
    limit: number;
    common: boolean;
}

export default async function fetchWords(supabase: SupabaseClient, options: WordOptions) {
    return await supabase.from(options.common ? 'random_frequent_words' : 'random_words')
        .select('text,length')
        .limit(options.limit)
        .gte('length', options.minLength)
        .lte('length', options.maxLength)
}