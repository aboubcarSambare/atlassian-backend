'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'this is an example'
  })

  fastify.post('/', async function (request, reply) {
    //const jiraEmail = process.env.JIRA_EMAIL;
    //const jiraApiToken = process.env.JIRA_API_TOKEN;
    const jiraDomain = process.env.JIRA_DOMAIN || 'sourcesense-demo.atlassian.net'; 
    const authHeader = 'Basic ' + Buffer.from(`aboubacar.sambare@sourcesense.com:ayaB5ivBlzVPZsV4EwLXA370`).toString('base64');
  
  
      const { body } = request;
  
      if ( !body.summary || !body.description) {
        reply.code(400).send({ error: 'Missing required fields for Jira issue creation.' });
        return;
      }
  
      const issueData = {
        fields: {
          project: { key: "GOOG" },
          summary: body.summary,
          description: body.description,
          issuetype: { name: body.issueType || 'Task' }
         
        }
      };
  
      try {
        const response = await fetch(`https://${jiraDomain}/rest/api/2/issue`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(issueData)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        reply.send({ success: true, issueKey: data.key });
      } catch (error) {
        reply.status(500).send({ error: 'Failed to create Jira issue', details: error.message });
      }
    
  })
}
