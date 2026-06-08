'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export interface IReview {
  _id: string;
  userId:  {
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  images: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductReviewsProps {
  productId: string;
  reviews: IReview[];
  onReviewSubmitted: () => void;
}

export default function ProductReviews({ productId, reviews, onReviewSubmitted }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError('Please login first');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!comment.trim()) {
      setError('Please enter your review');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, comment })
      });

      const data = await response.json();

      if (data.success) {
        setRating(0);
        setTitle('');
        setComment('');
        setShowForm(false);
        onReviewSubmitted();
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex items-start gap-4">
                <img
                  src={review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name || 'User'}`}
                  alt={review.userId?.name || 'User'}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.userId?.name || 'Anonymous'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                    {review.title}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                  <button className="text-sm text-gray-500 hover:text-blue-600 mt-2 inline-flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Button/Form */}
      {session ? (
        !showForm ? (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => setShowForm(true)} variant="primary">
              Write a Review
            </Button>
          </div>
        ) : (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <Button type="submit" variant="primary" isLoading={submitting}>
                  Submit Review
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Login to write a review
          </p>
          <Link href="/auth/login">
            <Button variant="primary">Login to Review</Button>
          </Link>
        </div>
      )}
    </div>
  );
}