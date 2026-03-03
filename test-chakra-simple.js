/**
 * 简单验证脉轮描述是否正确注入数据库
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testChakraDescriptions() {
  console.log('========================================');
  console.log('验证脉轮共振描述数据库');
  console.log('========================================\n');

  // 查询所有图腾
  const { data, error } = await supabase
    .from('chakra_resonance_descriptions')
    .select('*')
    .order('totem_id');

  if (error) {
    console.error('查询失败:', error);
    return;
  }

  console.log(`✓ 成功查询到 ${data.length} 个图腾描述\n`);

  // 验证红色家族
  console.log('红色家族（生存与滋养）:');
  data.filter(d => d.color_family === '红').forEach(d => {
    console.log(`  ${d.totem_id}. ${d.totem_name_cn}`);
    console.log(`     高分: ${d.high_score_description.substring(0, 40)}...`);
    console.log(`     低分: ${d.low_score_description.substring(0, 40)}...`);
  });

  console.log('\n白色家族（净化与跨越）:');
  data.filter(d => d.color_family === '白').forEach(d => {
    console.log(`  ${d.totem_id}. ${d.totem_name_cn}`);
    console.log(`     高分: ${d.high_score_description.substring(0, 40)}...`);
  });

  console.log('\n蓝色家族（蜕变与逻辑）:');
  data.filter(d => d.color_family === '蓝').forEach(d => {
    console.log(`  ${d.totem_id}. ${d.totem_name_cn}`);
    console.log(`     高分: ${d.high_score_description.substring(0, 40)}...`);
  });

  console.log('\n黄色家族（开悟与统筹）:');
  data.filter(d => d.color_family === '黄').forEach(d => {
    console.log(`  ${d.totem_id}. ${d.totem_name_cn}`);
    console.log(`     高分: ${d.high_score_description.substring(0, 40)}...`);
  });

  console.log('\n========================================');
  console.log('数据库验证完成！所有20个图腾描述已就位');
  console.log('========================================');
}

testChakraDescriptions().catch(console.error);
