"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, MessageCircle, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useApp } from "@/lib/store"

export default function WishlistPage() {
  const { state, dispatch } = useApp()
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingId(productId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId })
    setRemovingId(null)
  }

  const handleContactSeller = (product: any) => {
    // Navigate to messages with seller context
    router.push(`/messages?seller=${product.seller.name}&product=${product.id}`)
  }

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
          <p className="text-gray-600 mb-6">Save your favorite items and never lose track of them</p>
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="relative">
              <Heart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-xl"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding items you love to your wishlist. They'll appear here for easy access later.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-gray-600">
            {state.wishlist.length} {state.wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.wishlist.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border-0 shadow-lg rounded-xl"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Remove from wishlist button */}
                <Button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  disabled={removingId === product.id}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  size="sm"
                >
                  {removingId === product.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                {/* Special badges */}
                {product.category === "donate-giveaway" && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                    FREE
                  </Badge>
                )}
                {product.category === "moving-out" && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg animate-pulse">
                    URGENT
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {product.title}
                </h3>

                <div className="mb-3">
                  {product.price === 0 ? (
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      FREE
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through bg-gray-100 px-2 py-1 rounded">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Seller info */}
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 shadow-md">
                      <AvatarImage src={product.seller.avatar || "/placeholder.svg"} alt={product.seller.name} />
                      <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {product.seller.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{product.seller.name}</p>
                      {product.seller.verified && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Link href={`/listing/${product.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleContactSeller(product)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
