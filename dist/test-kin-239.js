/**
 * 浏览器 Console 测试脚本
 * 复制此文件内容到浏览器开发者工具的 Console 中执行
 */

console.log('%c🔬 Kin 239 诊断测试开始', 'color: #4caf50; font-size: 16px; font-weight: bold;');
console.log('─'.repeat(60));

// 从当前页面环境中获取 Supabase 客户端
const testKin239 = async () => {
  try {
    // 尝试从全局获取 supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ 无法获取 Supabase 配置');
      console.log('请在 .env 文件中检查以下变量：');
      console.log('  VITE_SUPABASE_URL');
      console.log('  VITE_SUPABASE_ANON_KEY');
      return;
    }

    console.log('✅ Supabase 配置已加载');
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);

    // 动态导入 Supabase
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.57.4');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('\n📡 测试 1: 直接查询数据库');
    console.log('─'.repeat(60));

    const { data: totemData, error: totemError } = await supabase
      .from('totems')
      .select('id, name_cn, heart_chakra, throat_chakra, pineal_gland, operation_mode')
      .eq('id', 19)
      .maybeSingle();

    if (totemError) {
      console.error('❌ 数据库查询失败:', totemError);
      return;
    }

    console.log('✅ 蓝风暴图腾数据：');
    console.table({
      '心轮': { 实际值: totemData.heart_chakra, 预期值: 40, 匹配: totemData.heart_chakra === 40 ? '✅' : '❌' },
      '喉轮': { 实际值: totemData.throat_chakra, 预期值: 82, 匹配: totemData.throat_chakra === 82 ? '✅' : '❌' },
      '松果体': { 实际值: totemData.pineal_gland, 预期值: 95, 匹配: totemData.pineal_gland === 95 ? '✅' : '❌' }
    });

    console.log('\n🧮 测试 2: 计算 Kin 239（蓝风暴 + 超频）');
    console.log('─'.repeat(60));

    // 超频调性修正值（根据最新代码）
    const toneModifiers = {
      heart: 0,    // 超频对心轮修正 = 0
      throat: 0,   // 超频对喉轮修正 = 0
      pineal: 3    // 超频对松果体修正 = +3
    };

    const calculated = {
      heart: totemData.heart_chakra + toneModifiers.heart,
      throat: totemData.throat_chakra + toneModifiers.throat,
      pineal: totemData.pineal_gland + toneModifiers.pineal
    };

    const gemini = {
      heart: 40,
      throat: 82,
      pineal: 98
    };

    console.log('计算公式：');
    console.log(`  心轮 = ${totemData.heart_chakra} (基础) + ${toneModifiers.heart} (超频修正) = ${calculated.heart}`);
    console.log(`  喉轮 = ${totemData.throat_chakra} (基础) + ${toneModifiers.throat} (超频修正) = ${calculated.throat}`);
    console.log(`  松果体 = ${totemData.pineal_gland} (基础) + ${toneModifiers.pineal} (超频修正) = ${calculated.pineal}`);

    console.log('\n对比 Gemini 标准答案：');
    console.table({
      '心轮': { 计算值: calculated.heart, Gemini值: gemini.heart, 匹配: calculated.heart === gemini.heart ? '✅' : '❌' },
      '喉轮': { 计算值: calculated.throat, Gemini值: gemini.throat, 匹配: calculated.throat === gemini.throat ? '✅' : '❌' },
      '松果体': { 计算值: calculated.pineal, Gemini值: gemini.pineal, 匹配: calculated.pineal === gemini.pineal ? '✅' : '❌' }
    });

    const allMatch = calculated.heart === gemini.heart &&
                     calculated.throat === gemini.throat &&
                     calculated.pineal === gemini.pineal;

    if (allMatch) {
      console.log('\n%c🎉 完美！所有值都匹配 Gemini 标准答案！', 'color: #4caf50; font-size: 14px; font-weight: bold;');
      console.log('%c✨ 数据库和计算逻辑都正确', 'color: #4caf50;');
      console.log('%c⚠️ 如果页面仍显示旧数据，请清除浏览器缓存：', 'color: #ff9800; font-weight: bold;');
      console.log('%c   Windows/Linux: Ctrl + Shift + R', 'color: #ff9800;');
      console.log('%c   Mac: Cmd + Shift + R', 'color: #ff9800;');
    } else {
      console.log('\n%c⚠️ 存在不匹配的值', 'color: #f44336; font-size: 14px; font-weight: bold;');

      if (totemData.heart_chakra !== 40) {
        console.log('%c❌ 数据库问题：蓝风暴心轮应为 40，实际为 ' + totemData.heart_chakra, 'color: #f44336;');
      }

      if (calculated.heart !== gemini.heart) {
        console.log('%c❌ 计算问题：心轮计算结果与 Gemini 不符', 'color: #f44336;');
      }
    }

    console.log('\n📊 完整报告数据：');
    console.log({
      Kin: 239,
      图腾: '蓝风暴',
      调性: '超频',
      运作模式: totemData.operation_mode,
      数据库基础值: {
        心轮: totemData.heart_chakra,
        喉轮: totemData.throat_chakra,
        松果体: totemData.pineal_gland
      },
      调性修正: toneModifiers,
      最终计算值: calculated,
      Gemini标准答案: gemini
    });

  } catch (error) {
    console.error('❌ 测试过程出错:', error);
    console.log('请确保：');
    console.log('  1. 页面已完全加载');
    console.log('  2. 网络连接正常');
    console.log('  3. Supabase 服务可访问');
  }
};

// 执行测试
testKin239();
