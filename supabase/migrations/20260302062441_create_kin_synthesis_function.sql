/*
  # Create Kin Synthesis Algorithm (G-N-P Algorithm)

  1. New Functions
    - `synthesize_kin_profile(kin_num integer)` - Generates dynamic Kin profile using G-N-P algorithm
      - G (General): Extract life essence from wavespell
      - N (Numerical): Extract chakra values from seal base percentages
      - P (Personalized): Generate 2026 White Wind year recommendations based on throat chakra

  2. Purpose
    - Auto-generate profiles for Kin not in featured_kin_profiles
    - Return consistent JSON structure for all Kin numbers
    - Combine wavespell context, seal energy, and annual guidance
*/

CREATE OR REPLACE FUNCTION synthesize_kin_profile(kin_num integer)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  wavespell_data record;
  seal_data record;
  tone_data record;
  throat_guidance text;
BEGIN
  -- Validate input
  IF kin_num < 1 OR kin_num > 260 THEN
    RETURN jsonb_build_object('error', 'Invalid Kin number');
  END IF;

  -- G (General): Get wavespell context
  SELECT * INTO wavespell_data
  FROM wavespells
  WHERE kin_start <= kin_num AND kin_end >= kin_num
  LIMIT 1;

  -- N (Numerical): Get seal and tone info
  -- Seal ID: ((kin_num - 1) % 20) + 1
  -- Tone ID: ((kin_num - 1) % 13) + 1
  SELECT * INTO seal_data
  FROM seals
  WHERE id = ((kin_num - 1) % 20) + 1;

  SELECT * INTO tone_data
  FROM tones
  WHERE id = ((kin_num - 1) % 13) + 1;

  -- P (Personalized): Generate 2026 White Wind year guidance based on throat chakra
  IF seal_data.throat_chakra >= 80 THEN
    throat_guidance := '2026白风年对你极为有利。你的喉轮能量天生强大，今年宇宙会放大你的表达力与传播力。建议：主动分享你的智慧，你的声音会被更多人听见。';
  ELSIF seal_data.throat_chakra >= 60 THEN
    throat_guidance := '2026白风年是你喉轮升级的黄金期。今年适合练习真实表达，无论是写作、演讲还是创作。建议：每日进行声音冥想，激活喉轮能量场。';
  ELSIF seal_data.throat_chakra >= 40 THEN
    throat_guidance := '2026白风年提醒你：学会聆听内在声音。你的喉轮能量中等，今年重点不在于大声说话，而在于说对的话。建议：少说多做，用行动传播你的理念。';
  ELSE
    throat_guidance := '2026白风年是你深度内观的一年。喉轮能量较低意味着你的力量在行动而非言语。建议：用作品说话，让成果成为你最有力的表达。';
  END IF;

  -- Build result
  result := jsonb_build_object(
    'kin_number', kin_num,
    'synthesis_type', 'auto_generated',
    'wavespell', jsonb_build_object(
      'name_cn', wavespell_data.name_cn,
      'name_en', wavespell_data.name_en,
      'wave_type', wavespell_data.wave_type,
      'life_essence', wavespell_data.life_essence,
      'long_term_purpose', wavespell_data.long_term_purpose
    ),
    'seal', jsonb_build_object(
      'name_cn', seal_data.name_cn,
      'name_en', seal_data.name_en,
      'keywords', seal_data.keywords,
      'pineal_gland', seal_data.pineal_gland,
      'heart_chakra', seal_data.heart_chakra,
      'throat_chakra', seal_data.throat_chakra
    ),
    'tone', jsonb_build_object(
      'name_cn', tone_data.name_cn,
      'name_en', tone_data.name_en,
      'power', tone_data.power,
      'action', tone_data.action,
      'essence', tone_data.essence
    ),
    'year_2026_guidance', throat_guidance,
    'auto_summary', format(
      '你是 %s（%s）的 %s 能量携带者，处于 %s（%s）的生命底色中。%s 你的调性是 %s，这赋予你 %s 的行动模式。%s',
      seal_data.name_cn,
      seal_data.name_en,
      tone_data.name_cn,
      wavespell_data.name_cn,
      wavespell_data.life_essence,
      wavespell_data.long_term_purpose,
      tone_data.name_cn,
      tone_data.essence,
      throat_guidance
    )
  );

  RETURN result;
END;
$$;