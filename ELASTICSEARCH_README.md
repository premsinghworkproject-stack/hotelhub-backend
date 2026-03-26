# Elasticsearch Integration for Hotel Search

This document explains the Elasticsearch integration for the hotel search functionality.

## Overview

The hotel search system now uses Elasticsearch for improved search performance and relevance while maintaining the existing GraphQL API interface.

## Architecture

### Components

1. **Elasticsearch Module** (`src/modules/elasticsearch/`)
   - `elasticsearch.module.ts` - Module configuration
   - `elasticsearch.service.ts` - ES client and search operations
   - `elasticsearch.controller.ts` - Health check endpoints

2. **Hotel Repository Updates**
   - `searchWithElasticsearch()` - ES-based search method
   - `indexHotelInElasticsearch()` - Index individual hotels
   - `deleteHotelFromElasticsearch()` - Remove from index

3. **Hotel Service Updates**
   - Smart routing between ES and SQL based on query complexity
   - Fallback to SQL if ES is unavailable

4. **Seeding Script**
   - `src/scripts/seed-elasticsearch.ts` - Bulk index hotels

## Features

### Search Capabilities

- **Full-text search** across hotel names, descriptions, cities, states, countries
- **Field weighting** (name^3, city^2, state^2, country^2)
- **Fuzzy matching** for typo tolerance
- **Range filtering** (rating, price)
- **Terms filtering** (amenities, meal plan, property type)
- **Pagination support** (limit, offset)
- **Relevance scoring**

### Smart Routing

The system automatically chooses between Elasticsearch and SQL:

**Use Elasticsearch for:**
- Text searches (`searchQuery`)
- Multiple amenities filtering
- Rating ranges (`minRating` + `maxRating`)
- Price ranges (`minPrice` + `maxPrice`)

**Use SQL for:**
- Simple field filters (city, state, country only)
- When Elasticsearch is unavailable
- Fallback scenarios

## Setup

### Prerequisites

1. Elasticsearch server running (default: `http://localhost:9200`)
2. Hotel data in the database

### Environment Variables

```bash
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=your_username  # Optional
ELASTICSEARCH_PASSWORD=your_password  # Optional
```

### Installation

1. Install Elasticsearch packages:
   ```bash
   npm install @elastic/elasticsearch @nestjs/elasticsearch
   ```

2. Start Elasticsearch server

3. Create and populate the index:
   ```bash
   npm run seed:elasticsearch
   ```

## Usage

### API Usage

The GraphQL API remains unchanged:

```graphql
query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    description
    city
    state
    country
    rating
    totalReviews
  }
}
```

### Health Check

Monitor Elasticsearch status:
```bash
GET /elasticsearch/health
```

### Index Management

Create hotel index:
```bash
GET /elasticsearch/create-index
```

## Performance Benefits

### Before (SQL only)
- `LIKE` queries with `%wildcard%` patterns
- No relevance scoring
- Limited text search capabilities
- Performance degrades with large datasets

### After (Elasticsearch)
- Inverted index for fast text search
- TF-IDF relevance scoring
- Fuzzy matching and stemming
- Scales to millions of records
- Sub-second search responses

## Monitoring

### Health Checks

The system includes automatic health checks:
- Elasticsearch connectivity monitoring
- Automatic fallback to SQL if ES is down
- Error logging for debugging

### Logging

Check logs for:
- Elasticsearch availability status
- Search routing decisions
- Indexing operations
- Error details

## Troubleshooting

### Common Issues

1. **Elasticsearch unavailable**
   - Check if ES server is running
   - Verify connection settings
   - System will fall back to SQL automatically

2. **Search results different**
   - ES uses relevance scoring vs SQL ordering
   - Check field weights in ES query
   - Verify index data matches database

3. **Index out of sync**
   - Run seeding script to update index
   - Check hotel update/delete operations
   - Verify automatic indexing is working

### Debug Commands

```bash
# Check ES health
curl http://localhost:9200/_cluster/health

# Check index status
curl http://localhost:9200/hotels/_stats

# Search directly in ES
curl -X POST http://localhost:9200/hotels/_search -H "Content-Type: application/json" -d '{"query":{"match_all":{}}}'
```

## Maintenance

### Regular Tasks

1. **Index Updates**: Hotels are automatically indexed on create/update/delete
2. **Periodic Re-indexing**: Run seeding script for full refresh
3. **Monitoring**: Check ES health and performance metrics

### Backup and Recovery

- ES index can be rebuilt from database at any time
- Use snapshots for ES cluster backup
- Database remains the source of truth

## Future Enhancements

- Real-time indexing with database triggers
- Search analytics and metrics
- Advanced search features (geo-distance, more like this)
- Performance optimization with search templates
