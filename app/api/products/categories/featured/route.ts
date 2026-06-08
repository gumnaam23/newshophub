import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category'; // If you have Category model

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const featured = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    products: { $push: '$$ROOT' }
                }
            },
            { $match: { count: { $gte: 5 } } },
            { $limit: 6 },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'name',
                    as: 'categoryInfo'
                }
            },
            {
                $project: {
                    name: '$_id',
                    slug: '$_id',
                    description: { $arrayElemAt: ['$products.description', 0] },
                    image: { $arrayElemAt: ['$products.images', 0] },
                    productCount: '$count',
                    featured: true,
                    icon: { $arrayElemAt: ['$categoryInfo.icon', 0] }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: featured
        });

    } catch (error) {
        console.error('Featured Categories Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch featured categories' },
            { status: 500 }
        );
    }
}