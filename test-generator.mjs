import { generateFakeSkill } from './src/lib/ollama';
import { detectLanguage, normalizeName } from './src/lib/utils';

async function testFakeSkillGenerator() {
  console.log('🎭 Testing Fake Skill Generator...\n');
  
  const testPrompt = 'regar las plantas de mi casa';
  const language = detectLanguage(testPrompt);
  const normalizedName = normalizeName(testPrompt);
  
  console.log('📋 Input:');
  console.log(`  Prompt: "${testPrompt}"`);
  console.log(`  Language detected: ${language}`);
  console.log(`  Normalized name: ${normalizedName}`);
  console.log('');
  
  try {
    const content = await generateFakeSkill({
      prompt: testPrompt,
      language,
      name: normalizedName
    });
    
    console.log('✅ Generated Skill:');
    console.log('─'.repeat(60));
    console.log(content);
    console.log('─'.repeat(60));
    console.log('');
    
    // Count words
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    console.log(`📊 Word count: ${wordCount} words (target: 500-600)`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n⚠️  Likely issue: API key not configured correctly');
    console.log('   Fix: Add your real Ollama API key in src/data/.env.local');
  }
}

testFakeSkillGenerator();
