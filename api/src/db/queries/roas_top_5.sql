-- Section 3: Speed Tasks — Q3: Top 5 Campaigns by ROAS (Return on Ad Spend) per Client
-- ROAS = conversions / spend (simplified ratio)
-- Filtering: Active campaigns deleted_at IS NULL, from last 30 days.

WITH ranked_campaigns AS (
  SELECT
    c.id,
    c.name,
    cl.name AS client_name,
    -- ROAS calculation with NULLIF to avoid division by zero
    ROUND(c.conversions::NUMERIC / NULLIF(c.spend, 0), 4) AS roas,
    -- Ranking campaigns per client based on ROAS desc
    ROW_NUMBER() OVER (
      PARTITION BY c.client_id
      ORDER BY (c.conversions::NUMERIC / NULLIF(c.spend, 0)) DESC
    ) AS rank
  FROM campaigns c
  JOIN clients cl ON cl.id = c.client_id
  WHERE
    c.deleted_at IS NULL
    AND c.start_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT client_name, name, roas
FROM ranked_campaigns
WHERE rank <= 5
ORDER BY client_name, rank;
