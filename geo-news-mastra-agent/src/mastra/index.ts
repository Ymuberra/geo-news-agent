
import { Mastra } from '@mastra/core';
import { geoNewsAgent } from './agents/geo-news-agent';
import { geoNewsTool } from './tools/geo-news';

export const mastra = new Mastra({
  agents: {
    geoNewsAgent
  },
  tools: {
    geoNews: geoNewsTool
  }
});
