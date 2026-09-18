import { createClient } from '@supabase/supabase-js'

function getRequiredEnvironmentVariable(variableName: string): string {
  const variableValue = process.env[variableName]

  if (!variableValue) {
    throw new Error(`${variableName} is required`)
  }

  return variableValue
}

const supabaseUrl = getRequiredEnvironmentVariable('SUPABASE_URL')
const supabaseSecretKey = getRequiredEnvironmentVariable('SUPABASE_SECRET_KEY')

export const supabase = createClient(supabaseUrl, supabaseSecretKey)
