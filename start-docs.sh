#!/bin/bash

echo "🚀 GraphQL Documentation Quick Start"
echo "=================================="
echo ""
echo "1. Starting development server..."
echo ""

# Start the development server
npm run start:dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo "✅ Server started!"
echo ""
echo "📚 GraphQL Documentation Options:"
echo ""
echo "🎯 Primary Documentation (GraphQL Playground):"
echo "   URL: http://localhost:3000/graphql"
echo "   Features: Interactive queries, schema explorer, examples"
echo ""
echo "🔧 Advanced Documentation (Apollo Sandbox):"
echo "   URL: https://studio.apollographql.com/sandbox"
echo "   Endpoint: http://localhost:3000/graphql"
echo "   Features: Enhanced UI, query history, better schema view"
echo ""
echo "📖 Available Operations:"
echo "   • Users: createUser, user, users"
echo "   • Hotels: createHotel, hotel, hotels, searchHotels"
echo "   • Bookings: createBooking, booking, bookings, bookingsByUser, bookingsByHotel"
echo ""
echo "💡 Tips:"
echo "   • Check the 'DOCS' tab in GraphQL Playground for detailed API docs"
echo "   • Use the provided examples in the documentation"
echo "   • All queries include real-time validation and autocompletion"
echo ""
echo "📄 For more details, see: GRAPHQL-DOCUMENTATION.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Wait for user to stop
wait $SERVER_PID
