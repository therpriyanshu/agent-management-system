/**
 * Distribute list items equally among agents
 * @param {Array} items - Array of list items from CSV
 * @param {Array} agents - Array of agent objects
 * @returns {Array} - Array of items with assigned agent IDs
 */
const distributeItems = (items, agents) => {
  if (!items || items.length === 0) {
    throw new Error("No items to distribute");
  }

  if (!agents || agents.length === 0) {
    throw new Error("No agents available for distribution");
  }

  // Calculate items per agent
  const totalItems = items.length;
  const totalAgents = agents.length;
  const itemsPerAgent = Math.floor(totalItems / totalAgents);
  const remainingItems = totalItems % totalAgents;

  console.log(`Distributing ${totalItems} items among ${totalAgents} agents`);
  console.log(`Base items per agent: ${itemsPerAgent}`);
  console.log(`Remaining items: ${remainingItems}`);

  const distributedItems = [];
  let currentIndex = 0;

  // Distribute items to each agent
  for (let i = 0; i < totalAgents; i++) {
    // Calculate how many items this agent should get
    // First 'remainingItems' agents get one extra item
    const itemsForThisAgent = itemsPerAgent + (i < remainingItems ? 1 : 0);

    console.log(
      `Agent ${i + 1} (${agents[i].name}): ${itemsForThisAgent} items`
    );

    // Assign items to this agent
    for (let j = 0; j < itemsForThisAgent; j++) {
      if (currentIndex < totalItems) {
        distributedItems.push({
          ...items[currentIndex],
          assignedTo: agents[i]._id,
        });
        currentIndex++;
      }
    }
  }

  console.log(`Total distributed items: ${distributedItems.length}`);

  return distributedItems;
};

/**
 * Get distribution summary
 * @param {Array} distributedItems - Array of distributed items
 * @param {Array} agents - Array of agent objects
 * @returns {Array} - Summary of distribution per agent
 */
const getDistributionSummary = (distributedItems, agents) => {
  const summary = agents.map((agent) => {
    const itemsCount = distributedItems.filter(
      (item) => item.assignedTo.toString() === agent._id.toString()
    ).length;

    return {
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      itemsAssigned: itemsCount,
    };
  });

  return summary;
};

module.exports = {
  distributeItems,
  getDistributionSummary,
};
