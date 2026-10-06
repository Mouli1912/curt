const fs = require('fs');
const path = require('path');

/**
 * Controller to fetch skill graph for a target role
 * GET /api/graph/:role
 */
const getSkillGraph = async (req, res) => {
  try {
    const { role } = req.params;
    const targetRole = role || 'frontend-developer';

    const roleSpecificPath = path.join(__dirname, `../../../data/skill_graph_${targetRole}.json`);
    const fallbackPath = path.join(__dirname, '../../../data/skill_graph.json');

    let graphFilePath = roleSpecificPath;
    if (!fs.existsSync(graphFilePath)) {
      graphFilePath = fallbackPath;
    }

    if (!fs.existsSync(graphFilePath)) {
      return res.status(404).json({
        error: `Skill graph data file not found for role '${targetRole}'. Please run graph_builder.py.`,
        role: targetRole
      });
    }

    const rawData = fs.readFileSync(graphFilePath, 'utf-8');
    const skillGraph = JSON.parse(rawData);

    return res.status(200).json(skillGraph);
  } catch (error) {
    console.error('[GraphController Error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve skill graph data' });
  }
};

module.exports = {
  getSkillGraph
};
