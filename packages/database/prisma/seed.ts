import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 10)

  const user = await prisma.user.upsert({
    where: { email: 'demo@etic.com' },
    update: {},
    create: {
      email: 'demo@etic.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  })

  console.log('✅ User created:', user.email)

  // Create demo store
  const store = await prisma.store.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      name: 'Demo Store',
      slug: 'demo-store',
      description: 'Demo e-ticaret mağazası',
      plan: 'PROFESSIONAL',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Store created:', store.name)

  // Link user to store as owner
  await prisma.storeUser.upsert({
    where: {
      storeId_userId: {
        storeId: store.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      storeId: store.id,
      role: 'OWNER',
    },
  })

  console.log('✅ User linked to store as OWNER')

  // Create categories
  const electronics = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'elektronik',
      },
    },
    update: {},
    create: {
      name: 'Elektronik',
      slug: 'elektronik',
      description: 'Elektronik ürünler',
      storeId: store.id,
    },
  })

  const clothing = await prisma.category.upsert({
    where: {
      storeId_slug: {
        storeId: store.id,
        slug: 'giyim',
      },
    },
    update: {},
    create: {
      name: 'Giyim',
      slug: 'giyim',
      description: 'Giyim ürünleri',
      storeId: store.id,
    },
  })

  console.log('✅ Categories created')

  // Create products
  const products = [
    {
      title: { tr: 'iPhone 15 Pro', en: 'iPhone 15 Pro' },
      slug: 'iphone-15-pro',
      description: { tr: 'En yeni iPhone modeli', en: 'Latest iPhone model' },
      price: 45000.00,
      compareAtPrice: 50000.00,
      sku: 'IP15P-001',
      barcode: '1234567890123',
      quantity: 50,
      categoryId: electronics.id,
      status: 'ACTIVE' as const,
    },
    {
      title: { tr: 'Samsung Galaxy S24', en: 'Samsung Galaxy S24' },
      slug: 'samsung-galaxy-s24',
      description: { tr: 'Samsung\'un amiral gemisi telefonu', en: 'Samsung flagship phone' },
      price: 38000.00,
      sku: 'SGS24-001',
      barcode: '1234567890124',
      quantity: 35,
      categoryId: electronics.id,
      status: 'ACTIVE' as const,
    },
    {
      title: { tr: 'Klasik T-Shirt', en: 'Classic T-Shirt' },
      slug: 'klasik-t-shirt',
      description: { tr: '%100 pamuklu t-shirt', en: '100% cotton t-shirt' },
      price: 299.90,
      compareAtPrice: 399.90,
      sku: 'TSH-001',
      barcode: '1234567890125',
      quantity: 150,
      categoryId: clothing.id,
      status: 'ACTIVE' as const,
    },
    {
      title: { tr: 'Slim Fit Kot Pantolon', en: 'Slim Fit Jeans' },
      slug: 'slim-fit-kot-pantolon',
      description: { tr: 'Modern kesim kot pantolon', en: 'Modern cut jeans' },
      price: 599.90,
      sku: 'JNS-001',
      barcode: '1234567890126',
      quantity: 80,
      categoryId: clothing.id,
      status: 'ACTIVE' as const,
    },
  ]

  for (const productData of products) {
    const { categoryId, ...productWithoutCategory } = productData

    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        storeId: store.id,
        slug: productData.slug,
      },
    })

    if (!existingProduct) {
      const product = await prisma.product.create({
        data: {
          ...productWithoutCategory,
          storeId: store.id,
          categories: {
            create: {
              categoryId: categoryId,
            },
          },
        },
      })
      console.log(`✅ Product created: ${JSON.stringify(product.title)}`)
    } else {
      console.log(`⏭️  Product already exists: ${productData.slug}`)
    }
  }

  // Create a customer
  const customer = await prisma.customer.upsert({
    where: {
      storeId_email: {
        storeId: store.id,
        email: 'customer@example.com',
      },
    },
    update: {},
    create: {
      email: 'customer@example.com',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '+905551234567',
      storeId: store.id,
    },
  })

  console.log('✅ Customer created:', customer.email)

  // Create customer address if not exists
  const existingAddress = await prisma.customerAddress.findFirst({
    where: {
      customerId: customer.id,
    },
  })

  if (!existingAddress) {
    await prisma.customerAddress.create({
      data: {
        customerId: customer.id,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '+905551234567',
        address1: 'Atatürk Caddesi No:123',
        city: 'İstanbul',
        province: 'İstanbul',
        zip: '34000',
        country: 'TR',
        isDefault: true,
      },
    })
    console.log('✅ Customer address created')
  } else {
    console.log('⏭️  Customer address already exists')
  }

  // Get all products for orders
  const allProducts = await prisma.product.findMany({
    where: { storeId: store.id },
  })

  if (allProducts.length > 0) {
    // Create sample orders
    const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const paymentStatuses = ['PENDING', 'PAID', 'PAID', 'PAID', 'PAID']
    const fulfillmentStatuses = ['UNFULFILLED', 'UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'FULFILLED']

    for (let i = 0; i < 5; i++) {
      const orderExists = await prisma.order.findFirst({
        where: {
          storeId: store.id,
          orderNumber: `ORD-2024-00${i + 1}`,
        },
      })

      if (!orderExists) {
        const selectedProducts = allProducts.slice(0, Math.min(i + 1, allProducts.length))
        const subtotal = selectedProducts.reduce((sum, p) => sum + Number(p.price), 0)
        const tax = subtotal * 0.18
        const shipping = 50.00
        const total = subtotal + tax + shipping

        const order = await prisma.order.create({
          data: {
            storeId: store.id,
            customerId: customer.id,
            orderNumber: `ORD-2024-00${i + 1}`,
            email: customer.email,
            phone: customer.phone,
            orderStatus: orderStatuses[i] as any,
            paymentStatus: paymentStatuses[i] as any,
            fulfillmentStatus: fulfillmentStatuses[i] as any,
            currency: 'TRY',
            subtotal,
            tax,
            shipping,
            total,
            billingAddress: {
              firstName: 'Ahmet',
              lastName: 'Yılmaz',
              phone: '+905551234567',
              address1: 'Atatürk Caddesi No:123',
              city: 'İstanbul',
              province: 'İstanbul',
              zip: '34000',
              country: 'TR',
            },
            shippingAddress: {
              firstName: 'Ahmet',
              lastName: 'Yılmaz',
              phone: '+905551234567',
              address1: 'Atatürk Caddesi No:123',
              city: 'İstanbul',
              province: 'İstanbul',
              zip: '34000',
              country: 'TR',
            },
            items: {
              create: selectedProducts.map((product) => ({
                productId: product.id,
                title: typeof product.title === 'string' ? product.title : (product.title as any).tr || 'Product',
                sku: product.sku || undefined,
                quantity: 1,
                price: Number(product.price),
                total: Number(product.price),
              })),
            },
          },
        })

        console.log(`✅ Order created: ${order.orderNumber}`)
      } else {
        console.log(`⏭️  Order already exists: ORD-2024-00${i + 1}`)
      }
    }
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
