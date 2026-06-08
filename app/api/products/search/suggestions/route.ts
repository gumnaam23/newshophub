import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';


type SuggestionItem = {
  _id: string;
  count: number;
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    
    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    const suggestions = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { brand: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $facet: {
          names: [
            { $group: { _id: '$name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ],
          brands: [
            { $group: { _id: '$brand', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
          ],
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
          ]
        }
      }
    ]);
    
    const allSuggestions = [
      ...suggestions[0].names.map((s: SuggestionItem) => ({ query: s._id, count: s.count })),
      ...suggestions[0].brands.map((s: SuggestionItem) => ({ query: s._id, count: s.count })),
      ...suggestions[0].categories.map((s: SuggestionItem) => ({ query: s._id, count: s.count }))
    ];
    
    // Remove duplicates
    const unique = Array.from(new Map(allSuggestions.map(s => [s.query, s])).values());
    
    return NextResponse.json({
      success: true,
      data: unique.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Search Suggestions Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}