import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: React.ReactNode;
  summary: string;
  summaryColor: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function ReportSection({
  title,
  icon,
  summary,
  summaryColor,
  children,
  defaultExpanded = false
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="report-section">
      <div className="report-section-header">
        <div className="report-section-title">
          <div className="report-section-icon">{icon}</div>
          <span>{title}</span>
        </div>
      </div>

      <div className="report-section-summary" style={{ color: summaryColor }}>
        {summary}
      </div>

      <button
        className="report-expand-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '收起详细报告' : '查看详细报告'}
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <div className={`report-section-details ${isExpanded ? 'expanded' : ''}`}>
        {children}
      </div>

      <style>{`
        .report-section {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .report-section:hover {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .report-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .report-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.1em;
          font-family: 'Noto Serif SC', serif;
        }

        .report-section-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .report-section-summary {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.8;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          margin-bottom: 20px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          border-left: 4px solid currentColor;
        }

        .report-expand-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.12em;
          font-family: 'Noto Serif SC', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .report-expand-button:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .report-expand-button:active {
          transform: translateY(0);
        }

        .report-section-details {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .report-section-details.expanded {
          max-height: 5000px;
        }

        .report-detail-content {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 300;
          line-height: 2;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          white-space: pre-line;
        }

        .report-formula {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(100, 200, 255, 0.3);
          border-radius: 10px;
          padding: 16px 20px;
          margin: 16px 0;
          font-family: 'Courier New', monospace;
          color: rgba(100, 200, 255, 0.95);
          font-size: 13px;
          letter-spacing: 0.05em;
          line-height: 1.8;
        }

        .report-subsection {
          margin: 20px 0;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .report-subsection:first-child {
          border-top: none;
          padding-top: 0;
        }

        .report-subsection-title {
          color: rgba(255, 220, 150, 0.9);
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
          font-family: 'Noto Serif SC', serif;
        }

        .report-list {
          list-style: none;
          padding: 0;
          margin: 12px 0;
        }

        .report-list li {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          line-height: 2;
          letter-spacing: 0.08em;
          font-family: 'Noto Serif SC', serif;
          padding: 8px 0 8px 24px;
          position: relative;
        }

        .report-list li::before {
          content: '•';
          position: absolute;
          left: 8px;
          color: rgba(255, 200, 100, 0.7);
          font-weight: bold;
        }

        .report-list.do-list li::before {
          color: rgba(100, 220, 120, 0.8);
        }

        .report-list.avoid-list li::before {
          color: rgba(255, 100, 100, 0.8);
        }
      `}</style>
    </div>
  );
}
