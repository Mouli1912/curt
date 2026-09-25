const fs = require('fs');
const path = require('path');

/**
 * Controller to fetch skill graph for a target role
 * GET /api/graph/:role
 */
const getSkillGraph = async (req, res) => {
  try {
    const { role } = req.params;
    // Currently supports frontend-developer
    const graphFilePath = path.join(__dirname, '../../../data/skill_graph.json');

    if (!fs.existsSync(graphFilePath)) {
      return res.status(444).json({
        error: 'Skill graph data file not found. Please run graph_builder.py first.',
        role
      });
    }

    const rawData = fs.readFileSync(graphFilePath, 'utf-8');
    const skillGraph = JSON.parse(rawData);

    // Filter by role if needed (matches role or defaults to primary graph)
    return res.status(200).json(skillGraph);
  } catch (error) {
    console.error('[GraphController Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve skill graph data' });
  }
};

module.exports = {
  getSkillGraph
};
