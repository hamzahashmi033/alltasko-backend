const categories = [
    {
        category: "Handyman Services",
        subcategories: [
            {
                subcategory: "General Repairs & Maintenance",
                subSubcategories: [
                    "Small Home Repairs",
                    "Door Repair & Installation",
                    "Window Repair & Replacement",
                    "Drywall Repair & Patching",
                    "Ceiling Repair",
                    "Caulking & Sealing"
                ]
            },
            {
                subcategory: "Furniture & Fixture Installation",
                subSubcategories: [
                    "Furniture Assembly",
                    "TV Mounting",
                    "Shelf & Storage Installation",
                    "Picture & Mirror Hanging",
                    "Curtain & Blinds Installation",
                    "Ceiling Fan & Light Fixture Installation"
                ]
            },
            {
                subcategory: "Carpentry & Woodwork",
                subSubcategories: [
                    "Custom Shelving & Cabinets",
                    "Trim & Molding Installation",
                    "Deck & Porch Repair",
                    "Fence & Gate Repair",
                    "Staircase Repair"
                ]
            },
            {
                subcategory: "Plumbing Help",
                subSubcategories: [
                    "Faucet Replacement",
                    "Toilet Repair & Installation",
                    "Garbage Disposal Repair",
                    "Showerhead & Sink Installation",
                    "Leak Detection & Fixing"
                ]
            },
            {
                subcategory: "Electrical Help",
                subSubcategories: [
                    "Light Fixture Replacement",
                    "Switch & Outlet Installation",
                    "Doorbell & Intercom Installation",
                    "Basic Electrical Troubleshooting"
                ]
            },
            {
                subcategory: "Flooring & Tile Work",
                subSubcategories: [
                    "Tile Repair & Replacement",
                    "Grout Cleaning & Sealing",
                    "Vinyl & Laminate Floor Installation",
                    "Hardwood Floor Repair"
                ]
            },
            {
                subcategory: "Outdoor & Exterior Work",
                subSubcategories: [
                    "Gutter Cleaning & Repair",
                    "Pressure Washing",
                    "Fence Staining & Sealing",
                    "Shed Assembly & Repair",
                    "Deck Staining & Waterproofing"
                ]
            },
            {
                subcategory: "Home Organization & Efficiency",
                subSubcategories: [
                    "Closet & Storage Solutions",
                    "Garage Decluttering",
                    "Home Energy Efficiency Upgrades"
                ]
            },
            {
                subcategory: "Specialty Handyman Services",
                subSubcategories: [
                    "Smart Home Setup",
                    "Aging-in-Place Modifications",
                    "Pet Door Installation",
                    "Weatherproofing & Insulation"
                ]
            }
        ]
    },
    {
        category: "Moving Services",
        subcategories: [
            {
                subcategory: "Residential Moving",
                subSubcategories: [
                    "Local Moving",
                    "Long-Distance Moving",
                    "Apartment Moving",
                    "Senior Moving Assistance",
                    "College Dorm Moving"
                ]
            },
            {
                subcategory: "Commercial & Office Moving",
                subSubcategories: [
                    "Office Relocation",
                    "Store & Retail Moving",
                    "Warehouse Moving",
                    "Industrial Equipment Moving"
                ]
            },
            {
                subcategory: "Packing & Unpacking",
                subSubcategories: [
                    "Full-Service Packing",
                    "Fragile Item Packing",
                    "Unpacking & Organizing",
                    "Packing Material Supply"
                ]
            },
            {
                subcategory: "Furniture & Specialty Item Moving",
                subSubcategories: [
                    "Furniture Disassembly & Reassembly",
                    "Heavy Furniture Moving",
                    "Piano Moving",
                    "Safe Moving",
                    "Pool Table Moving",
                    "Gym Equipment Moving"
                ]
            },
            {
                subcategory: "Loading & Unloading Services",
                subSubcategories: [
                    "Truck Loading & Unloading",
                    "Container Loading & Unloading",
                    "PODS & Storage Unit Loading"
                ]
            },
            {
                subcategory: "Labor-Only Moving Help",
                subSubcategories: [
                    "Moving Labor Assistance",
                    "Heavy Lifting Help",
                    "Rearranging Furniture"
                ]
            },
            {
                subcategory: "Storage & Transportation Solutions",
                subSubcategories: [
                    "Short-Term Storage",
                    "Long-Term Storage",
                    "Climate-Controlled Storage"
                ]
            },
            {
                subcategory: "Junk Removal & Cleanouts",
                subSubcategories: [
                    "Moving Cleanup Services",
                    "Furniture & Appliance Removal",
                    "Estate Cleanouts"
                ]
            },
            {
                subcategory: "Specialty Moving Services",
                subSubcategories: [
                    "White Glove Moving",
                    "Last-Minute Moving",
                    "Military Moving Assistance"
                ]
            }
        ]
    },
    {
        category: "Cleaning Services",
        subcategories: [
            {
                subcategory: "Residential Cleaning",
                subSubcategories: [
                    "Regular House Cleaning",
                    "Deep Cleaning",
                    "Move-In/Move-Out Cleaning",
                    "Airbnb & Vacation Rental Cleaning",
                    "Post-Construction Cleaning",
                    "Seasonal Cleaning"
                ]
            },
            {
                subcategory: "Commercial & Office Cleaning",
                subSubcategories: [
                    "Office Cleaning",
                    "Retail Store Cleaning",
                    "Restaurant & Kitchen Cleaning",
                    "Warehouse Cleaning",
                    "Medical Facility Cleaning"
                ]
            },
            {
                subcategory: "Specialized Cleaning Services",
                subSubcategories: [
                    "Carpet & Rug Cleaning",
                    "Upholstery Cleaning",
                    "Mattress Cleaning",
                    "Tile & Grout Cleaning",
                    "Pressure Washing",
                    "Window Cleaning",
                    "Gutter Cleaning"
                ]
            },
            {
                subcategory: "Move-Related Cleaning",
                subSubcategories: [
                    "Move-In Cleaning",
                    "Move-Out Cleaning",
                    "Real Estate & Staging Cleaning"
                ]
            },
            {
                subcategory: "Eco-Friendly & Green Cleaning",
                subSubcategories: [
                    "Non-Toxic Cleaning",
                    "Allergen-Free Cleaning",
                    "Pet-Safe Cleaning"
                ]
            },
            {
                subcategory: "Post-Event & Special Occasion Cleaning",
                subSubcategories: [
                    "After-Party Cleanup",
                    "Wedding & Event Venue Cleaning"
                ]
            },
            {
                subcategory: "Hoarding & Extreme Cleaning",
                subSubcategories: [
                    "Hoarding Cleanup",
                    "Estate Cleanouts",
                    "Junk Removal & Cleanup"
                ]
            },
            {
                subcategory: "Vehicle & Outdoor Cleaning",
                subSubcategories: [
                    "Car Interior Detailing",
                    "RV & Boat Cleaning",
                    "Garage Cleaning"
                ]
            }
        ]
    },
    {
        category: "Yardwork & Outdoor Services",
        subcategories: [
            {
                subcategory: "Lawn Care & Maintenance",
                subSubcategories: [
                    "Lawn Mowing",
                    "Edging & Trimming",
                    "Weed Removal & Prevention",
                    "Sod Installation",
                    "Lawn Aeration & Seeding",
                    "Fertilization & Soil Treatment"
                ]
            },
            {
                subcategory: "Landscaping & Garden Services",
                subSubcategories: [
                    "Garden Design & Planting",
                    "Mulching & Soil Installation",
                    "Hedge & Bush Trimming",
                    "Flower Bed Maintenance",
                    "Tree & Shrub Planting"
                ]
            },
            {
                subcategory: "Tree & Shrub Services",
                subSubcategories: [
                    "Tree Trimming & Pruning",
                    "Tree Removal",
                    "Stump Grinding & Removal",
                    "Bush & Shrub Removal"
                ]
            },
            {
                subcategory: "Yard Cleanup & Waste Removal",
                subSubcategories: [
                    "Leaf Removal",
                    "Storm Debris Cleanup",
                    "Gutter Cleaning",
                    "Seasonal Yard Cleanup"
                ]
            },
            {
                subcategory: "Irrigation & Water Management",
                subSubcategories: [
                    "Sprinkler System Installation",
                    "Sprinkler Repair & Maintenance",
                    "Drip Irrigation Setup"
                ]
            },
            {
                subcategory: "Outdoor Structure & Hardscaping Services",
                subSubcategories: [
                    "Fence Installation & Repair",
                    "Deck & Patio Repair",
                    "Retaining Wall Installation",
                    "Walkway & Driveway Maintenance"
                ]
            },
            {
                subcategory: "Outdoor Cleaning & Pressure Washing",
                subSubcategories: [
                    "House Exterior Cleaning",
                    "Deck & Patio Pressure Washing",
                    "Sidewalk & Driveway Cleaning"
                ]
            },
            {
                subcategory: "Winter Services",
                subSubcategories: [
                    "Snow Removal",
                    "Ice Management",
                    "Roof Snow Removal"
                ]
            },
            {
                subcategory: "Pest & Wildlife Control",
                subSubcategories: [
                    "Mosquito & Insect Control",
                    "Rodent Prevention & Removal",
                    "Weed & Pest Control for Lawns"
                ]
            }
        ]
    },
    {
        category: "Cabinet & Countertop Services",
        subcategories: [
            {
                subcategory: "Cabinet Installation & Repair",
                subSubcategories: [
                    "Kitchen Cabinet Installation",
                    "Bathroom Cabinet Installation",
                    "Custom Cabinet Installation",
                    "Cabinet Refacing & Refinishing",
                    "Cabinet Repair & Adjustment",
                    "Soft-Close Hinge Installation",
                    "Cabinet Hardware Installation (Handles & Knobs)"
                ]
            },
            {
                subcategory: "Countertop Installation & Replacement",
                subSubcategories: [
                    "Kitchen Countertop Installation",
                    "Bathroom Vanity Countertop Installation",
                    "Custom Countertop Fabrication",
                    "Countertop Repair & Refinishing",
                    "Countertop Resealing & Polishing"
                ]
            },
            {
                subcategory: "Countertop Material Services",
                subSubcategories: [
                    "Granite Countertop Installation & Repair",
                    "Quartz Countertop Installation & Repair",
                    "Marble Countertop Installation & Repair",
                    "Butcher Block Countertop Installation & Sealing",
                    "Laminate Countertop Installation & Repair"
                ]
            },
            {
                subcategory: "Specialty Cabinet & Countertop Work",
                subSubcategories: [
                    "Floating Shelves Installation",
                    "Wet Bar & Kitchen Island Countertops",
                    "Pantry Shelving & Storage Solutions",
                    "Backsplash Installation",
                    "Epoxy & Resin Countertop Coating"
                ]
            },
            {
                subcategory: "Commercial Cabinet & Countertop Services",
                subSubcategories: [
                    "Office & Retail Cabinet Installation",
                    "Restaurant & Bar Countertop Installation",
                    "Medical & Laboratory Countertops"
                ]
            }
        ]
    },
    {
        category: "Disaster Recovery & Home Restoration",
        subcategories: [
            {
                subcategory: "Water Damage Restoration",
                subSubcategories: [
                    "Flood Damage Cleanup",
                    "Water Extraction & Drying",
                    "Mold Remediation & Prevention",
                    "Sewage Cleanup & Sanitation"
                ]
            },
            {
                subcategory: "Fire & Smoke Damage Restoration",
                subSubcategories: [
                    "Fire Damage Cleanup & Repair",
                    "Smoke & Soot Removal",
                    "Odor Removal & Air Purification",
                    "Structural Repair & Rebuilding"
                ]
            },
            {
                subcategory: "Storm & Wind Damage Repair",
                subSubcategories: [
                    "Roof & Siding Repair",
                    "Fallen Tree Removal",
                    "Window & Door Replacement",
                    "Emergency Board-Up Services"
                ]
            },
            {
                subcategory: "Mold & Mildew Remediation",
                subSubcategories: [
                    "Mold Inspection & Testing",
                    "Mold Removal & Treatment",
                    "Moisture Control & Prevention"
                ]
            },
            {
                subcategory: "Biohazard & Trauma Cleanup",
                subSubcategories: [
                    "Hazardous Material Removal",
                    "Crime Scene & Trauma Cleanup",
                    "Hoarding Cleanup"
                ]
            },
            {
                subcategory: "Insurance Claim Assistance",
                subSubcategories: [
                    "Damage Assessment & Documentation",
                    "Coordination with Insurance Companies",
                    "Temporary Housing Arrangements"
                ]
            },
            {
                subcategory: "Home Structural Restoration",
                subSubcategories: [
                    "Drywall & Ceiling Repair",
                    "Flooring Restoration",
                    "Foundation Repair & Stabilization"
                ]
            },
            {
                subcategory: "Emergency Services & Temporary Solutions",
                subSubcategories: [
                    "Temporary Roof Tarping",
                    "Water Pumping & Basement Waterproofing",
                    "Emergency Power & Generator Setup"
                ]
            }
        ]
    },
    {
        category: "Event Help & Setup",
        subcategories: [
            {
                subcategory: "Event Setup & Breakdown",
                subSubcategories: [
                    "Venue Setup & Decoration",
                    "Table & Chair Arrangement",
                    "Tent & Canopy Setup",
                    "Stage & Backdrop Setup",
                    "Dance Floor Installation"
                ]
            },
            {
                subcategory: "Catering & Food Service",
                subSubcategories: [
                    "Buffet & Food Station Setup",
                    "Bartending & Beverage Service",
                    "Waitstaff & Serving Assistance",
                    "Cleanup & Dishwashing"
                ]
            },
            {
                subcategory: "Entertainment & Audio Setup",
                subSubcategories: [
                    "DJ & Sound System Setup",
                    "Microphone & PA System Installation",
                    "Lighting & Special Effects Setup",
                    "Photo Booth & Props Setup"
                ]
            },
            {
                subcategory: "Party & Wedding Decoration",
                subSubcategories: [
                    "Balloon Decorations & Arches",
                    "Floral Arrangements & Centerpieces",
                    "Themed Party Decorations",
                    "Wedding Arch & Aisle Decor"
                ]
            },
            {
                subcategory: "Rental Equipment Setup & Coordination",
                subSubcategories: [
                    "Table, Chair, & Linen Rentals",
                    "Tent & Canopy Rental Setup",
                    "Heating & Cooling Equipment Setup",
                    "Portable Restroom & Handwashing Station Setup"
                ]
            },
            {
                subcategory: "Corporate & Business Event Services",
                subSubcategories: [
                    "Conference Room Setup",
                    "Trade Show Booth Installation",
                    "Corporate Event Coordination",
                    "Seminar & Workshop Assistance"
                ]
            },
            {
                subcategory: "Private & Social Gatherings",
                subSubcategories: [
                    "Birthday & Anniversary Party Setup",
                    "Baby Shower & Gender Reveal Setup",
                    "Graduation & Retirement Party Assistance",
                    "Holiday Party Setup"
                ]
            },
            {
                subcategory: "Cleanup & Post-Event Services",
                subSubcategories: [
                    "Venue Cleaning & Breakdown",
                    "Trash Removal & Recycling",
                    "Equipment & Rental Return Assistance"
                ]
            },
            {
                subcategory: "Specialized & Themed Events",
                subSubcategories: [
                    "Outdoor Festival & Fair Setup",
                    "Fundraiser & Charity Event Support",
                    "Fashion Show & Runway Setup",
                    "Movie Night & Outdoor Cinema Setup"
                ]
            }
        ]
    },
    {
        category: "Home Staging & Interior Services",
        subcategories: [
            {
                subcategory: "Home Staging for Real Estate",
                subSubcategories: [
                    "Full Home Staging for Sale",
                    "Partial Home Staging & Styling",
                    "Vacant Home Staging",
                    "Model Home & Showroom Staging",
                    "Virtual Home Staging"
                ]
            },
            {
                subcategory: "Interior Decorating & Styling",
                subSubcategories: [
                    "Room Makeover & Restyling",
                    "Seasonal & Holiday Home Decorating",
                    "Color Consultation & Paint Selection",
                    "Furniture Selection & Arrangement",
                    "Wall Art & Decor Placement"
                ]
            },
            {
                subcategory: "Furniture & Space Planning",
                subSubcategories: [
                    "Space Optimization & Layout Planning",
                    "Small Apartment & Tiny Home Design",
                    "Open Floor Plan Styling",
                    "Office & Workspace Organization"
                ]
            },
            {
                subcategory: "Rental & Airbnb Staging",
                subSubcategories: [
                    "Short-Term Rental Styling",
                    "Luxury & High-End Airbnb Staging",
                    "Vacation Home Decor Setup"
                ]
            },
            {
                subcategory: "Lighting & Ambiance Enhancement",
                subSubcategories: [
                    "Smart Lighting & Mood Setup",
                    "Accent Lighting & Fixture Placement",
                    "Window Treatments & Curtain Selection"
                ]
            },
            {
                subcategory: "Home Organization & Decluttering",
                subSubcategories: [
                    "Closet Organization & Storage Solutions",
                    "Pantry & Kitchen Organization",
                    "Garage & Basement Decluttering",
                    "Home Office Organization"
                ]
            },
            {
                subcategory: "Temporary & Event Decor Setup",
                subSubcategories: [
                    "Party & Special Event Home Decorating",
                    "Wedding & Reception Venue Styling",
                    "Photo Shoot & Film Set Design"
                ]
            },
            {
                subcategory: "Commercial & Retail Interior Services",
                subSubcategories: [
                    "Office & Business Interior Decorating",
                    "Boutique & Storefront Staging",
                    "Hospitality & Restaurant Interior Setup"
                ]
            }
        ]
    },
    {
        category: "Photography & Media Services",
        subcategories: [
            {
                subcategory: "Photography Services",
                subSubcategories: [
                    "Portrait & Headshot Photography",
                    "Family & Maternity Photography",
                    "Wedding & Engagement Photography",
                    "Event & Party Photography",
                    "Corporate & Business Photography"
                ]
            },
            {
                subcategory: "Real Estate & Architectural Photography",
                subSubcategories: [
                    "Residential Real Estate Photography",
                    "Commercial Property Photography",
                    "Interior & Exterior Photography",
                    "Aerial & Drone Photography"
                ]
            },
            {
                subcategory: "Product & Commercial Photography",
                subSubcategories: [
                    "E-commerce & Online Store Product Photography",
                    "Food & Beverage Photography",
                    "Fashion & Apparel Photography",
                    "Jewelry & Small Item Photography"
                ]
            },
            {
                subcategory: "Creative & Artistic Photography",
                subSubcategories: [
                    "Fine Art & Conceptual Photography",
                    "Black & White Photography",
                    "Street & Urban Photography",
                    "Boudoir & Glamour Photography"
                ]
            },
            {
                subcategory: "Sports & Action Photography",
                subSubcategories: [
                    "Professional & Amateur Sports Photography",
                    "Outdoor & Adventure Photography",
                    "Motorsports & Racing Photography"
                ]
            },
            {
                subcategory: "Travel & Landscape Photography",
                subSubcategories: [
                    "Nature & Wildlife Photography",
                    "Cityscape & Urban Photography",
                    "Travel Blogging & Destination Photography"
                ]
            },
            {
                subcategory: "Videography & Filmmaking",
                subSubcategories: [
                    "Event & Wedding Videography",
                    "Corporate & Business Video Production",
                    "Music Video Production",
                    "Documentary & Short Film Production"
                ]
            },
            {
                subcategory: "Drone & Aerial Media Services",
                subSubcategories: [
                    "Aerial Photography & Videography",
                    "Real Estate & Property Aerial Shots",
                    "Construction Site Monitoring",
                    "Aerial Inspections & Surveys"
                ]
            },
            {
                subcategory: "Editing & Post-Production Services",
                subSubcategories: [
                    "Photo Retouching & Enhancement",
                    "Video Editing & Color Grading",
                    "Motion Graphics & Animation",
                    "Slideshow & Photo Montage Creation"
                ]
            },
            {
                subcategory: "Social Media & Digital Content",
                subSubcategories: [
                    "Instagram & TikTok Content Creation",
                    "YouTube Video Editing & Production",
                    "Branding & Personal Content Photography"
                ]
            }
        ]
    },
    {
        category: "Auto Customization & Repair",
        subcategories: [
            {
                subcategory: "General Auto Repair & Maintenance",
                subSubcategories: [
                    "Engine Diagnostics & Repair",
                    "Brake Repair & Replacement",
                    "Transmission Repair & Maintenance",
                    "Battery Replacement & Electrical Repairs",
                    "Suspension & Steering Repairs"
                ]
            },
            {
                subcategory: "Auto Body & Collision Repair",
                subSubcategories: [
                    "Dent Repair & Paintless Dent Removal",
                    "Scratch & Chip Repair",
                    "Frame & Structural Repairs",
                    "Bumper Repair & Replacement"
                ]
            },
            {
                subcategory: "Custom Paint & Wraps",
                subSubcategories: [
                    "Full Car Repainting & Color Change",
                    "Custom Graphics & Vinyl Wraps",
                    "Matte, Gloss, & Chrome Wraps",
                    "Headlight & Taillight Tinting"
                ]
            },
            {
                subcategory: "Performance Upgrades & Modifications",
                subSubcategories: [
                    "Engine Tuning & ECU Remapping",
                    "Turbo & Supercharger Installation",
                    "Performance Exhaust & Cold Air Intake Upgrades",
                    "Suspension & Lowering Kit Installation"
                ]
            },
            {
                subcategory: "Wheels, Tires & Brakes",
                subSubcategories: [
                    "Custom Wheels & Rims Installation",
                    "Tire Mounting, Balancing & Rotation",
                    "Brake Caliper Painting",
                    "High-Performance Brake Kits"
                ]
            },
            {
                subcategory: "Car Audio & Electronics",
                subSubcategories: [
                    "Custom Car Audio System Installation",
                    "Subwoofer & Amplifier Installation",
                    "Touchscreen Stereo & Apple CarPlay/Android Auto Setup",
                    "GPS & Navigation System Installation"
                ]
            },
            {
                subcategory: "Lighting Upgrades",
                subSubcategories: [
                    "LED & HID Headlight Conversion",
                    "Underglow & Ambient Lighting Installation",
                    "Interior & Dashboard LED Upgrades"
                ]
            },
            {
                subcategory: "Window Tinting & Glass Services",
                subSubcategories: [
                    "Auto Window Tinting",
                    "Windshield Replacement & Repair",
                    "Sunroof Installation & Repair"
                ]
            },
            {
                subcategory: "Interior Customization & Upholstery",
                subSubcategories: [
                    "Custom Leather & Fabric Seat Covers",
                    "Steering Wheel & Dashboard Wraps",
                    "Floor Mats & Interior LED Lighting"
                ]
            },
            {
                subcategory: "Truck & Off-Road Modifications",
                subSubcategories: [
                    "Lift Kits & Leveling Kits",
                    "Off-Road Tires & Suspension Upgrades",
                    "Roof Racks & Storage Solutions"
                ]
            },
            {
                subcategory: "Exotic & Luxury Car Customization",
                subSubcategories: [
                    "Supercar Performance Upgrades",
                    "Carbon Fiber Body Kit Installation",
                    "Custom Interior Refinements"
                ]
            },
            {
                subcategory: "Motorcycle & ATV Customization",
                subSubcategories: [
                    "Custom Paint & Graphics",
                    "Performance Exhaust & Tuning",
                    "LED & Underbody Lighting"
                ]
            },
            {
                subcategory: "EV & Hybrid Vehicle Upgrades",
                subSubcategories: [
                    "Custom Tesla & EV Modifications",
                    "Battery Health & Performance Optimization",
                    "Charging Port & Adapter Installations"
                ]
            }
        ]
    },
    {
        category: "Legal & Financial Help",
        subcategories: [
            {
                subcategory: "Legal Services",
                subSubcategories: [
                    "Personal Injury & Accident Claims",
                    "Criminal Defense & Legal Representation",
                    "Family Law (Divorce, Custody, Adoption)",
                    "Immigration & Visa Assistance",
                    "Estate Planning (Wills & Trusts)",
                    "Contract Review & Drafting",
                    "Landlord-Tenant Disputes",
                    "Business & Corporate Law"
                ]
            },
            {
                subcategory: "Financial Planning & Consulting",
                subSubcategories: [
                    "Personal Budgeting & Money Management",
                    "Retirement Planning & 401(k) Guidance",
                    "Investment & Wealth Management",
                    "Tax Planning & Preparation",
                    "College Savings & Education Funds"
                ]
            },
            {
                subcategory: "Credit & Debt Services",
                subSubcategories: [
                    "Credit Repair & Score Improvement",
                    "Debt Consolidation & Settlement",
                    "Student Loan Assistance",
                    "Bankruptcy Counseling"
                ]
            },
            {
                subcategory: "Business Financial Services",
                subSubcategories: [
                    "Small Business Accounting & Bookkeeping",
                    "Payroll & Tax Filing for Businesses",
                    "Business Loan Consulting",
                    "Startup & Business Incorporation Services"
                ]
            },
            {
                subcategory: "Real Estate & Property Law",
                subSubcategories: [
                    "Real Estate Transactions & Contracts",
                    "Foreclosure & Short Sale Assistance",
                    "Property Tax Consulting",
                    "Home & Commercial Lease Agreement Review"
                ]
            },
            {
                subcategory: "Tax Services",
                subSubcategories: [
                    "Individual & Business Tax Preparation",
                    "IRS Audit Representation",
                    "Tax Deductions & Strategies"
                ]
            },
            {
                subcategory: "Insurance & Risk Management",
                subSubcategories: [
                    "Health & Life Insurance Consulting",
                    "Homeowners & Renters Insurance Advice",
                    "Auto & Commercial Insurance Assistance"
                ]
            },
            {
                subcategory: "Legal Document Assistance",
                subSubcategories: [
                    "Notary Public Services",
                    "Power of Attorney & Legal Forms",
                    "Name Change & Document Filing"
                ]
            },
            {
                subcategory: "Fraud & Identity Protection",
                subSubcategories: [
                    "Identity Theft Recovery Services",
                    "Consumer Rights & Fraud Protection",
                    "Legal Advice on Scams & Cybersecurity"
                ]
            }
        ]
    },
    {
        category: "Auto Services",
        subcategories: [
            {
                subcategory: "General Auto Maintenance & Repairs",
                subSubcategories: [
                    "Oil Change & Fluid Checks",
                    "Battery Replacement & Jump-Start",
                    "Brake Repair & Replacement",
                    "Engine Diagnostics & Tune-Up",
                    "Transmission Services",
                    "Radiator & Cooling System Repair"
                ]
            },
            {
                subcategory: "Tires & Wheels Services",
                subSubcategories: [
                    "Tire Change & Rotation",
                    "Wheel Balancing & Alignment",
                    "Tire Patching & Repair",
                    "Seasonal Tire Swaps"
                ]
            },
            {
                subcategory: "Car Cleaning & Detailing",
                subSubcategories: [
                    "Interior & Exterior Car Detailing",
                    "Headlight Restoration",
                    "Waxing & Paint Protection",
                    "Odor Removal"
                ]
            },
            {
                subcategory: "Auto Electrical & Lighting",
                subSubcategories: [
                    "Headlight & Taillight Replacement",
                    "Alternator & Starter Repair",
                    "Power Window & Lock Repair",
                    "Car Audio & Speaker Installation"
                ]
            },
            {
                subcategory: "Mobile Mechanic Services",
                subSubcategories: [
                    "On-Site Car Repairs",
                    "Roadside Assistance",
                    "Emergency Fuel Delivery",
                    "Lockout Services"
                ]
            },
            {
                subcategory: "Car Customization & Upgrades",
                subSubcategories: [
                    "Window Tinting",
                    "Car Wraps & Vinyl Graphics",
                    "Custom Paint Jobs",
                    "Performance Upgrades & Tuning"
                ]
            },
            {
                subcategory: "Air Conditioning & Heating",
                subSubcategories: [
                    "AC Recharge & Repair",
                    "Heater Core & Blower Motor Repair",
                    "Cabin Air Filter Replacement"
                ]
            },
            {
                subcategory: "Exhaust & Emissions Testing",
                subSubcategories: [
                    "Muffler & Exhaust Repair",
                    "Catalytic Converter Replacement",
                    "Emission System Diagnostics"
                ]
            },
            {
                subcategory: "Auto Glass Services",
                subSubcategories: [
                    "Windshield Repair & Replacement",
                    "Side & Rear Window Replacement",
                    "Window Chip Repair"
                ]
            },
            {
                subcategory: "Specialty Auto Services",
                subSubcategories: [
                    "RV & Camper Repair",
                    "Motorcycle Repair & Maintenance",
                    "Boat & Marine Vehicle Repair",
                    "ATV & Off-Road Vehicle Services"
                ]
            },
            {
                subcategory: "Towing & Transport Services",
                subSubcategories: [
                    "Emergency Towing",
                    "Long-Distance Car Transport",
                    "Motorcycle & Exotic Car Transport"
                ]
            }
        ]
    },
    {
        category: "Smart Home & Automation",
        subcategories: [
            {
                subcategory: "Smart Home Installation & Setup",
                subSubcategories: [
                    "Smart Home Consultation & Design",
                    "Smart Hub & Voice Assistant Setup (Alexa, Google Home, Apple HomeKit)",
                    "Smart Home Integration & Customization"
                ]
            },
            {
                subcategory: "Security & Surveillance",
                subSubcategories: [
                    "Security Camera Installation (Indoor & Outdoor)",
                    "Smart Doorbell Installation (Ring, Nest, etc.)",
                    "Smart Lock & Keyless Entry Setup",
                    "Home Alarm System Installation & Configuration"
                ]
            },
            {
                subcategory: "Smart Lighting & Energy Efficiency",
                subSubcategories: [
                    "Smart Light Bulb & Switch Installation",
                    "Motion Sensor Lighting Setup",
                    "Smart Thermostat Installation & Programming (Nest, Ecobee, Honeywell)",
                    "Smart Plug & Energy Monitoring Setup"
                ]
            },
            {
                subcategory: "Entertainment & Audio Systems",
                subSubcategories: [
                    "Home Theater & Surround Sound Setup",
                    "Smart TV & Streaming Device Installation (Roku, Apple TV, Fire Stick)",
                    "Multi-Room Audio System Installation (Sonos, Bose, etc.)",
                    "Smart Projector & Screen Setup"
                ]
            },
            {
                subcategory: "Automated Home Controls & Convenience",
                subSubcategories: [
                    "Motorized Blinds & Shades Installation",
                    "Smart Garage Door Opener Setup",
                    "Smart Irrigation System Installation & Programming",
                    "Smart Appliance Setup & Integration"
                ]
            },
            {
                subcategory: "Home Networking & Connectivity",
                subSubcategories: [
                    "Whole-Home WiFi & Mesh Network Setup (Eero, Orbi, Google Nest WiFi)",
                    "Smart Router Installation & Optimization",
                    "Ethernet & Smart Home Wiring"
                ]
            },
            {
                subcategory: "Advanced Smart Home Automation & Customization",
                subSubcategories: [
                    "Smart Home Scripting & Automation (IFTTT, Home Assistant, SmartThings)",
                    "Custom App & Remote Control Setup",
                    "AI-Based Home Automation Solutions"
                ]
            }
        ]
    },
    {
        category: "Electrical & Wiring Services",
        subcategories: [
            {
                subcategory: "General Electrical Services",
                subSubcategories: [
                    "Electrical Troubleshooting & Repairs",
                    "Circuit Breaker & Fuse Box Repair",
                    "Electrical Panel Upgrades & Installation",
                    "Whole-House Rewiring"
                ]
            },
            {
                subcategory: "Lighting Installation & Repair",
                subSubcategories: [
                    "Ceiling Fan & Light Fixture Installation",
                    "Recessed Lighting Installation",
                    "Outdoor & Landscape Lighting Setup",
                    "Motion Sensor & Security Lighting"
                ]
            },
            {
                subcategory: "Outlets, Switches & Wiring",
                subSubcategories: [
                    "Outlet Installation & Repair",
                    "GFCI Outlet Installation (Ground Fault Circuit Interrupter)",
                    "Dimmer Switch & Smart Switch Installation",
                    "USB Outlet & Smart Plug Setup"
                ]
            },
            {
                subcategory: "Smart Home Electrical Upgrades",
                subSubcategories: [
                    "Smart Thermostat Installation (Nest, Ecobee, Honeywell)",
                    "Smart Light Switches & Dimmers",
                    "Smart Home Hub & Automation Setup"
                ]
            },
            {
                subcategory: "Appliance & High-Power Connections",
                subSubcategories: [
                    "Electric Stove & Oven Wiring",
                    "Dishwasher & Garbage Disposal Wiring",
                    "Washer & Dryer Electrical Hookups",
                    "EV Charger Installation (Tesla, ChargePoint, etc.)"
                ]
            },
            {
                subcategory: "Home Theater & Audio Wiring",
                subSubcategories: [
                    "TV Mounting & Wiring",
                    "Home Theater Installation",
                    "Surround Sound & Speaker Wiring"
                ]
            },
            {
                subcategory: "Networking & Low-Voltage Wiring",
                subSubcategories: [
                    "Ethernet & Data Cable Installation",
                    "WiFi Access Point Installation",
                    "Security Camera & Doorbell Wiring"
                ]
            },
            {
                subcategory: "Outdoor & Specialty Electrical Work",
                subSubcategories: [
                    "Pool & Hot Tub Electrical Wiring",
                    "RV & Camper Electrical Hookups",
                    "Solar Panel Wiring & Integration"
                ]
            },
            {
                subcategory: "Emergency & Safety Electrical Services",
                subSubcategories: [
                    "Electrical Code Compliance & Safety Inspections",
                    "Emergency Electrical Repairs",
                    "Backup Generator Installation"
                ]
            }
        ]
    },
    {
        category: "HVAC & Climate Control",
        subcategories: [
            {
                subcategory: "Heating Services",
                subSubcategories: [
                    "Furnace Installation & Replacement",
                    "Furnace Repair & Maintenance",
                    "Boiler Installation & Repair",
                    "Heat Pump Installation & Repair",
                    "Radiator Installation & Maintenance"
                ]
            },
            {
                subcategory: "Air Conditioning Services",
                subSubcategories: [
                    "AC Installation & Replacement",
                    "AC Repair & Maintenance",
                    "Window & Portable AC Installation",
                    "Ductless Mini-Split AC Installation"
                ]
            },
            {
                subcategory: "Ventilation & Air Quality",
                subSubcategories: [
                    "Air Duct Cleaning & Sealing",
                    "Whole-House Ventilation System Installation",
                    "Air Purifier & Filtration System Setup",
                    "Humidifier & Dehumidifier Installation"
                ]
            },
            {
                subcategory: "Smart Climate Control",
                subSubcategories: [
                    "Smart Thermostat Installation (Nest, Ecobee, Honeywell)",
                    "Zoned HVAC System Setup",
                    "Energy-Efficient Climate Control Upgrades"
                ]
            },
            {
                subcategory: "Commercial HVAC Services",
                subSubcategories: [
                    "Industrial HVAC Installation & Maintenance",
                    "Rooftop Unit (RTU) Installation & Repair",
                    "Commercial Refrigeration Repair"
                ]
            },
            {
                subcategory: "Specialty HVAC Services",
                subSubcategories: [
                    "Wine Cellar Cooling System Installation",
                    "Server Room Cooling System Installation",
                    "Geothermal Heating & Cooling Solutions"
                ]
            },
            {
                subcategory: "Emergency & Seasonal HVAC Services",
                subSubcategories: [
                    "24/7 Emergency HVAC Repairs",
                    "Seasonal HVAC Tune-Ups & Inspections",
                    "Winterization & Summer Prep Services"
                ]
            }
        ]
    },
    {
        category: "Plumbing & Water Services",
        subcategories: [
            {
                subcategory: "General Plumbing Services",
                subSubcategories: [
                    "Leak Detection & Repair",
                    "Pipe Repair & Replacement",
                    "Drain Cleaning & Unclogging",
                    "Sewer Line Repair & Replacement",
                    "Plumbing Inspections & Maintenance"
                ]
            },
            {
                subcategory: "Fixture Installation & Repair",
                subSubcategories: [
                    "Faucet Installation & Repair",
                    "Toilet Installation & Repair",
                    "Shower & Bathtub Installation",
                    "Sink & Garbage Disposal Installation",
                    "Bidet Installation"
                ]
            },
            {
                subcategory: "Water Heater Services",
                subSubcategories: [
                    "Water Heater Installation & Replacement",
                    "Water Heater Repair & Maintenance",
                    "Tankless Water Heater Installation"
                ]
            },
            {
                subcategory: "Water Filtration & Softening",
                subSubcategories: [
                    "Water Softener Installation & Maintenance",
                    "Whole-House Water Filtration System Installation",
                    "Reverse Osmosis System Installation"
                ]
            },
            {
                subcategory: "Outdoor Plumbing Services",
                subSubcategories: [
                    "Sprinkler System Installation & Repair",
                    "Outdoor Faucet & Hose Bib Installation",
                    "Pool & Hot Tub Plumbing Repairs"
                ]
            },
            {
                subcategory: "Gas Line Plumbing Services",
                subSubcategories: [
                    "Gas Line Installation & Repair",
                    "Gas Appliance Hookups (Stove, Dryer, Fireplace)",
                    "Gas Leak Detection & Safety Inspections"
                ]
            },
            {
                subcategory: "Commercial & Industrial Plumbing",
                subSubcategories: [
                    "Restaurant & Kitchen Plumbing Services",
                    "Grease Trap Installation & Cleaning",
                    "Industrial Water System Maintenance"
                ]
            },
            {
                subcategory: "Emergency Plumbing Services",
                subSubcategories: [
                    "24/7 Emergency Plumbing Repairs",
                    "Burst Pipe Repair",
                    "Flood Damage & Water Cleanup"
                ]
            }
        ]
    },
    {
        category: "Security & Locksmith Services",
        subcategories: [
            {
                subcategory: "Locksmith Services",
                subSubcategories: [
                    "Lock Installation & Repair",
                    "Key Duplication & Rekeying",
                    "Lockout Assistance (Home, Car, Office)",
                    "Smart Lock Installation & Setup",
                    "High-Security Lock Installation"
                ]
            },
            {
                subcategory: "Key & Access Control Systems",
                subSubcategories: [
                    "Master Key System Setup",
                    "Keyless Entry System Installation",
                    "Card & Key Fob Access Control Systems",
                    "Biometric Lock Installation"
                ]
            },
            {
                subcategory: "Security Camera & Surveillance Installation",
                subSubcategories: [
                    "Home Security Camera Installation",
                    "Business & Commercial CCTV Setup",
                    "Wireless & Smart Camera Installation",
                    "Video Doorbell Installation (Ring, Nest, etc.)",
                    "Remote Monitoring System Setup"
                ]
            },
            {
                subcategory: "Alarm & Intrusion Detection Systems",
                subSubcategories: [
                    "Burglar Alarm Installation & Monitoring",
                    "Motion Sensor & Glass Break Detector Installation",
                    "Smart Alarm System Integration",
                    "Panic Button & Emergency Alert Systems"
                ]
            },
            {
                subcategory: "Safe & Vault Services",
                subSubcategories: [
                    "Safe Installation & Setup",
                    "Safe Opening & Combination Reset",
                    "Vault & Gun Safe Installation"
                ]
            },
            {
                subcategory: "Commercial & Business Security Solutions",
                subSubcategories: [
                    "Security System Design & Integration",
                    "Security Gates & Access Barriers Installation",
                    "Office & Warehouse Surveillance Systems"
                ]
            },
            {
                subcategory: "Emergency Security & Locksmith Services",
                subSubcategories: [
                    "24/7 Emergency Lockout Services",
                    "Emergency Lock Repair & Replacement",
                    "Break-In Damage Repair & Reinforcement"
                ]
            }
        ]
    },
    {
        category: "Roofing & Gutter Services",
        subcategories: [
            {
                subcategory: "Roof Installation & Replacement",
                subSubcategories: [
                    "Asphalt Shingle Roof Installation",
                    "Metal Roof Installation",
                    "Tile & Slate Roof Installation",
                    "Flat Roof Installation",
                    "Green & Solar Roof Installation"
                ]
            },
            {
                subcategory: "Roof Repair & Maintenance",
                subSubcategories: [
                    "Leak Detection & Roof Repair",
                    "Roof Inspection & Maintenance",
                    "Storm & Wind Damage Repair",
                    "Chimney & Flashing Repair",
                    "Skylight Installation & Repair"
                ]
            },
            {
                subcategory: "Gutter Services",
                subSubcategories: [
                    "Gutter Installation & Replacement",
                    "Gutter Cleaning & Maintenance",
                    "Gutter Guard Installation",
                    "Downspout Repair & Extension"
                ]
            },
            {
                subcategory: "Commercial Roofing Services",
                subSubcategories: [
                    "Industrial & Warehouse Roof Installation",
                    "TPO & EPDM Roof Installation",
                    "Roof Coating & Waterproofing"
                ]
            },
            {
                subcategory: "Specialty Roofing Services",
                subSubcategories: [
                    "Solar Panel Installation on Roofs",
                    "Roof Snow & Ice Removal",
                    "Cool Roofing Solutions for Energy Efficiency"
                ]
            },
            {
                subcategory: "Emergency Roofing Services",
                subSubcategories: [
                    "24/7 Emergency Roof Repair",
                    "Temporary Roof Tarping",
                    "Post-Storm Roof Restoration"
                ]
            }
        ]
    },
    {
        category: "Flooring Services",
        subcategories: [
            {
                subcategory: "Floor Installation & Replacement",
                subSubcategories: [
                    "Hardwood Floor Installation",
                    "Laminate & Vinyl Plank Flooring Installation",
                    "Tile Floor Installation",
                    "Carpet Installation & Replacement",
                    "Epoxy Flooring Installation"
                ]
            },
            {
                subcategory: "Floor Repair & Restoration",
                subSubcategories: [
                    "Hardwood Floor Refinishing & Staining",
                    "Tile & Grout Repair",
                    "Carpet Stretching & Repair",
                    "Water-Damaged Floor Repair"
                ]
            },
            {
                subcategory: "Specialty Flooring Services",
                subSubcategories: [
                    "Heated Flooring Installation",
                    "Garage Floor Coating & Sealing",
                    "Outdoor Patio & Deck Flooring",
                    "Concrete & Polished Concrete Flooring"
                ]
            },
            {
                subcategory: "Commercial & Industrial Flooring",
                subSubcategories: [
                    "Commercial Carpet & Tile Installation",
                    "Warehouse & Factory Flooring Solutions",
                    "Anti-Slip & Safety Flooring Installation"
                ]
            },
            {
                subcategory: "Floor Cleaning & Maintenance",
                subSubcategories: [
                    "Deep Cleaning & Floor Waxing",
                    "Tile & Grout Cleaning",
                    "Carpet Shampooing & Steam Cleaning"
                ]
            }
        ]
    },
    {
        category: "Commercial & Industrial Services",
        subcategories: [
            {
                subcategory: "Commercial Construction & Renovation",
                subSubcategories: [
                    "Office Build-Outs & Renovations",
                    "Retail Store Remodeling",
                    "Warehouse & Industrial Facility Construction",
                    "Commercial Flooring Installation",
                    "Interior & Exterior Painting for Businesses"
                ]
            },
            {
                subcategory: "Commercial Cleaning & Maintenance",
                subSubcategories: [
                    "Office & Corporate Cleaning Services",
                    "Industrial & Warehouse Cleaning",
                    "Pressure Washing for Commercial Properties",
                    "Commercial Carpet & Upholstery Cleaning",
                    "Post-Construction Cleaning"
                ]
            },
            {
                subcategory: "HVAC & Plumbing for Commercial Properties",
                subSubcategories: [
                    "Commercial HVAC Installation & Repair",
                    "Industrial Refrigeration Services",
                    "Commercial Boiler & Furnace Maintenance",
                    "Plumbing Repairs for Businesses",
                    "Grease Trap Installation & Cleaning"
                ]
            },
            {
                subcategory: "Electrical & Lighting for Businesses",
                subSubcategories: [
                    "Commercial Electrical Wiring & Panel Upgrades",
                    "Security Lighting & Motion Sensors",
                    "Backup Generators for Businesses",
                    "Parking Lot & Exterior Lighting Installation"
                ]
            },
            {
                subcategory: "Security & Surveillance for Businesses",
                subSubcategories: [
                    "Commercial Security Camera Installation",
                    "Access Control Systems (Keycard, Biometrics)",
                    "Burglar Alarm & Monitoring Systems",
                    "Fire Alarm & Emergency Exit Systems"
                ]
            },
            {
                subcategory: "Industrial Equipment Services",
                subSubcategories: [
                    "Machinery Installation & Repair",
                    "Heavy Equipment Moving & Hauling",
                    "Industrial Welding & Fabrication",
                    "Conveyor System Installation"
                ]
            },
            {
                subcategory: "Commercial Roofing & Gutter Services",
                subSubcategories: [
                    "Flat Roof Installation & Repair (TPO, EPDM)",
                    "Commercial Roof Coatings & Waterproofing",
                    "Storm Damage & Leak Repair",
                    "Gutter Installation & Maintenance for Businesses"
                ]
            },
            {
                subcategory: "Facility Management & Property Maintenance",
                subSubcategories: [
                    "Handyman & General Maintenance for Businesses",
                    "Janitorial & Custodial Services",
                    "Parking Lot Maintenance & Line Striping",
                    "Elevator & Escalator Maintenance"
                ]
            },
            {
                subcategory: "Specialty Industrial Services",
                subSubcategories: [
                    "Environmental Cleanup & Hazardous Waste Disposal",
                    "Industrial Painting & Coatings",
                    "Factory Relocation & Setup",
                    "Structural Steel Fabrication & Welding"
                ]
            }
        ]
    },
    {
        category: "Shopping & Delivery Services",
        subcategories: [
            {
                subcategory: "Personal Shopping & Errands",
                subSubcategories: [
                    "Grocery Shopping & Delivery",
                    "Prescription & Pharmacy Pickup",
                    "Clothing & Fashion Shopping Assistance",
                    "Specialty & Custom Item Shopping",
                    "Gift Shopping & Wrapping Services"
                ]
            },
            {
                subcategory: "Food & Meal Delivery",
                subSubcategories: [
                    "Restaurant Takeout & Delivery",
                    "Meal Prep & Ingredient Delivery",
                    "Farmers Market & Organic Grocery Pickup",
                    "Catering & Large Order Deliveries"
                ]
            },
            {
                subcategory: "Retail & Store Pickup",
                subSubcategories: [
                    "Big Box Store Order Pickup (Walmart, Target, Costco, etc.)",
                    "Electronics & Tech Item Pickup",
                    "Furniture & Home Goods Delivery",
                    "Pet Supply Pickup & Delivery"
                ]
            },
            {
                subcategory: "Courier & Package Delivery",
                subSubcategories: [
                    "Same-Day Package Delivery",
                    "Documents & Legal Paperwork Delivery",
                    "Parcel Pickup & Drop-Off (UPS, FedEx, USPS)",
                    "Custom & Fragile Item Delivery"
                ]
            },
            {
                subcategory: "Subscription & Specialty Item Delivery",
                subSubcategories: [
                    "Flower & Gift Basket Delivery",
                    "Alcohol & Wine Delivery",
                    "Beauty & Skincare Product Delivery",
                    "Book & Magazine Subscription Delivery"
                ]
            },
            {
                subcategory: "Moving & Bulk Item Delivery",
                subSubcategories: [
                    "Large Appliance & Furniture Delivery",
                    "Warehouse & Bulk Product Delivery",
                    "Business Supply & Equipment Delivery"
                ]
            },
            {
                subcategory: "Express & Emergency Delivery",
                subSubcategories: [
                    "Urgent Medical Supply Delivery",
                    "Last-Minute Gift & Flower Delivery",
                    "Express Courier & Messenger Services"
                ]
            }
        ]
    },
    {
        category: "Personal & Concierge Services",
        subcategories: [
            {
                subcategory: "Personal Assistance & Errands",
                subSubcategories: [
                    "Personal Shopping & Gift Wrapping",
                    "Grocery & Pharmacy Pickup",
                    "Dry Cleaning & Laundry Drop-Off/Pickup",
                    "Appointment Scheduling & Reservations",
                    "Document & Package Courier Services"
                ]
            },
            {
                subcategory: "Home & Lifestyle Management",
                subSubcategories: [
                    "Home Organization & Decluttering",
                    "House Sitting & Property Management",
                    "Mail & Package Handling (While Away)",
                    "Vacation Home Preparation"
                ]
            },
            {
                subcategory: "Travel & Transportation Services",
                subSubcategories: [
                    "Airport Pickup & Drop-Off",
                    "Travel Planning & Itinerary Management",
                    "Luggage Packing & Unpacking Services",
                    "Private Chauffeur & Driver Services"
                ]
            },
            {
                subcategory: "Event Planning & Coordination",
                subSubcategories: [
                    "Birthday & Special Occasion Planning",
                    "Wedding & Anniversary Coordination",
                    "Corporate Event Assistance",
                    "Venue & Catering Arrangements"
                ]
            },
            {
                subcategory: "Health & Wellness Concierge",
                subSubcategories: [
                    "Personal Trainer & Fitness Coaching",
                    "Meal Planning & Nutrition Guidance",
                    "At-Home Massage & Spa Services",
                    "Mental Wellness & Life Coaching"
                ]
            },
            {
                subcategory: "Senior & Family Assistance",
                subSubcategories: [
                    "Companion Care & Daily Assistance",
                    "Senior Transportation & Errands",
                    "Babysitting & Childcare Help",
                    "Pet Sitting & Walking Services"
                ]
            },
            {
                subcategory: "Luxury & VIP Services",
                subSubcategories: [
                    "Exclusive Restaurant & Event Reservations",
                    "Luxury Shopping & Personal Styling",
                    "Private Jet & Yacht Booking Assistance",
                    "Exclusive Concierge Membership Services"
                ]
            },
            {
                subcategory: "Emergency & Last-Minute Requests",
                subSubcategories: [
                    "24/7 Personal Assistance",
                    "Urgent Document & Parcel Delivery",
                    "Last-Minute Gift & Flower Arrangements"
                ]
            }
        ]
    },
    {
        category: "Tutoring & Education",
        subcategories: [
            {
                subcategory: "Academic Tutoring",
                subSubcategories: [
                    "Math Tutoring (Algebra, Geometry, Calculus, etc.)",
                    "Science Tutoring (Physics, Chemistry, Biology)",
                    "English & Reading Comprehension Tutoring",
                    "History & Social Studies Tutoring",
                    "Homework Help & Study Skills Coaching"
                ]
            },
            {
                subcategory: "Test Preparation",
                subSubcategories: [
                    "SAT & ACT Prep",
                    "GRE, GMAT, & LSAT Tutoring",
                    "TOEFL & IELTS Test Prep",
                    "AP & IB Exam Preparation",
                    "College Admissions Essay Coaching"
                ]
            },
            {
                subcategory: "Language Learning",
                subSubcategories: [
                    "English as a Second Language (ESL) Tutoring",
                    "Spanish, French, German, & Other Language Lessons",
                    "Business & Professional Language Coaching",
                    "Accent Reduction & Pronunciation Coaching"
                ]
            },
            {
                subcategory: "Music & Performing Arts",
                subSubcategories: [
                    "Piano, Guitar, & Other Instrument Lessons",
                    "Singing & Vocal Coaching",
                    "Music Theory & Composition Tutoring",
                    "Acting & Drama Coaching"
                ]
            },
            {
                subcategory: "STEM & Technology",
                subSubcategories: [
                    "Computer Science & Coding Lessons (Python, Java, etc.)",
                    "Robotics & Engineering Tutoring",
                    "Graphic Design & Digital Art Lessons",
                    "Video Editing & Animation Coaching"
                ]
            },
            {
                subcategory: "Professional & Career Training",
                subSubcategories: [
                    "Public Speaking & Communication Skills",
                    "Resume Writing & Interview Preparation",
                    "Business & Entrepreneurship Coaching",
                    "Leadership & Personal Development Training"
                ]
            },
            {
                subcategory: "Specialized & Alternative Learning",
                subSubcategories: [
                    "Montessori & Homeschool Support",
                    "Special Needs & Learning Disabilities Tutoring",
                    "Mindfulness & Meditation Coaching for Students",
                    "Financial Literacy & Money Management for Kids & Teens"
                ]
            },
            {
                subcategory: "Adult Education & Lifelong Learning",
                subSubcategories: [
                    "GED & High School Equivalency Tutoring",
                    "Career Change & Skills Development",
                    "Personal Finance & Investment Coaching",
                    "Creative Writing & Storytelling Workshops"
                ]
            }
        ]
    },
    {
        category: "Pest Control & Wildlife Removal",
        subcategories: [
            {
                subcategory: "General Pest Control Services",
                subSubcategories: [
                    "Residential Pest Control",
                    "Commercial Pest Control",
                    "Eco-Friendly & Non-Toxic Pest Control",
                    "Seasonal Pest Control Services"
                ]
            },
            {
                subcategory: "Insect Control & Extermination",
                subSubcategories: [
                    "Ant Control & Extermination",
                    "Cockroach Removal & Prevention",
                    "Termite Inspection & Treatment",
                    "Bed Bug Treatment & Heat Treatment",
                    "Flea & Tick Control",
                    "Mosquito Control & Fogging"
                ]
            },
            {
                subcategory: "Rodent Control & Removal",
                subSubcategories: [
                    "Rat & Mice Extermination",
                    "Rodent Prevention & Sealing Entry Points",
                    "Humane Trapping & Relocation",
                    "Dead Rodent Removal & Sanitation"
                ]
            },
            {
                subcategory: "Wildlife Removal & Prevention",
                subSubcategories: [
                    "Raccoon Removal & Exclusion",
                    "Squirrel Removal & Attic Cleanup",
                    "Skunk Removal & Odor Control",
                    "Bat Removal & Prevention",
                    "Bird Control & Nest Removal",
                    "Snake Removal & Prevention"
                ]
            },
            {
                subcategory: "Lawn & Outdoor Pest Control",
                subSubcategories: [
                    "Mole & Gopher Control",
                    "Wasp & Hornet Nest Removal",
                    "Fire Ant & Ground Pest Treatment",
                    "Tick & Mosquito Yard Treatment"
                ]
            },
            {
                subcategory: "Specialty Pest Control Services",
                subSubcategories: [
                    "Attic & Crawl Space Pest Proofing",
                    "Termite Damage Repair & Prevention",
                    "Pest Inspection for Home Buyers & Sellers",
                    "Pest Control Maintenance Plans"
                ]
            },
            {
                subcategory: "Emergency & Same-Day Services",
                subSubcategories: [
                    "24/7 Emergency Pest Control",
                    "Immediate Wildlife Removal",
                    "Urgent Infestation Treatment"
                ]
            }
        ]
    },
    {
        category: "Specialty Moving Services",
        subcategories: [
            {
                subcategory: "Large & Heavy Item Moving",
                subSubcategories: [
                    "Piano Moving",
                    "Safe & Vault Moving",
                    "Pool Table Moving",
                    "Gym Equipment Moving",
                    "Hot Tub & Spa Moving"
                ]
            },
            {
                subcategory: "Luxury & High-Value Item Moving",
                subSubcategories: [
                    "Fine Art & Antique Moving",
                    "Wine Collection Moving",
                    "High-End Furniture Moving",
                    "Collector’s Item & Memorabilia Transport"
                ]
            },
            {
                subcategory: "Vehicle & Specialty Transport",
                subSubcategories: [
                    "Motorcycle & ATV Transport",
                    "Boat & Jet Ski Transport",
                    "RV & Camper Relocation",
                    "Classic & Exotic Car Transport"
                ]
            },
            {
                subcategory: "Business & Industrial Moving",
                subSubcategories: [
                    "Commercial Equipment & Machinery Moving",
                    "Warehouse & Factory Relocation",
                    "Office & Corporate Moving",
                    "IT & Server Equipment Relocation"
                ]
            },
            {
                subcategory: "Assisted & Senior Moving",
                subSubcategories: [
                    "Senior & Retirement Home Relocation",
                    "Disability & Medical Equipment Moving",
                    "Downsizing & Estate Moving Assistance"
                ]
            },
            {
                subcategory: "Long-Distance & International Moving",
                subSubcategories: [
                    "Cross-Country Moving",
                    "International Relocation Services",
                    "Customs & Import/Export Assistance"
                ]
            },
            {
                subcategory: "Emergency & Last-Minute Moving",
                subSubcategories: [
                    "Same-Day Moving Services",
                    "24/7 Emergency Moving",
                    "Eviction & Foreclosure Moving"
                ]
            },
            {
                subcategory: "Eco-Friendly & Sustainable Moving",
                subSubcategories: [
                    "Green Moving (Reusable Packing Materials)",
                    "Donation & Recycling Services",
                    "Minimal Waste Packing & Moving"
                ]
            }
        ]
    },
    {
        category: "Outdoor & Pool Services",
        subcategories: [
            {
                subcategory: "Pool Installation & Maintenance",
                subSubcategories: [
                    "In-Ground Pool Installation",
                    "Above-Ground Pool Installation",
                    "Pool Liner Replacement",
                    "Pool Pump & Filter Installation",
                    "Pool Cleaning & Maintenance",
                    "Pool Tile & Surface Repair"
                ]
            },
            {
                subcategory: "Hot Tub & Spa Services",
                subSubcategories: [
                    "Hot Tub Installation & Setup",
                    "Hot Tub Repair & Maintenance",
                    "Spa & Jacuzzi Cleaning",
                    "Hot Tub Winterization & Storage"
                ]
            },
            {
                subcategory: "Outdoor Living & Landscaping",
                subSubcategories: [
                    "Patio & Deck Construction",
                    "Outdoor Kitchen & BBQ Installation",
                    "Fire Pit & Fireplace Installation",
                    "Pergola & Gazebo Installation"
                ]
            },
            {
                subcategory: "Irrigation & Water Management",
                subSubcategories: [
                    "Sprinkler System Installation",
                    "Drip Irrigation Setup",
                    "Sprinkler Repair & Maintenance",
                    "Rainwater Collection System Installation"
                ]
            },
            {
                subcategory: "Fencing & Hardscaping",
                subSubcategories: [
                    "Fence Installation & Repair",
                    "Retaining Wall Construction",
                    "Driveway & Walkway Paving",
                    "Outdoor Lighting Installation"
                ]
            },
            {
                subcategory: "Lawn & Garden Care",
                subSubcategories: [
                    "Lawn Mowing & Maintenance",
                    "Garden Design & Planting",
                    "Mulching & Soil Preparation",
                    "Tree & Shrub Trimming"
                ]
            },
            {
                subcategory: "Pond & Water Feature Services",
                subSubcategories: [
                    "Backyard Pond Installation",
                    "Fountain & Waterfall Setup",
                    "Koi Pond Maintenance",
                    "Water Feature Cleaning & Repairs"
                ]
            },
            {
                subcategory: "Winter & Seasonal Outdoor Services",
                subSubcategories: [
                    "Snow Removal & Ice Management",
                    "Holiday Lighting Installation",
                    "Storm Damage Cleanup",
                    "Outdoor Furniture Assembly & Setup"
                ]
            }
        ]
    },
    {
        category: "Storage & Organization",
        subcategories: [
            {
                subcategory: "Home Organization & Decluttering",
                subSubcategories: [
                    "Closet Organization & Custom Storage Solutions",
                    "Kitchen & Pantry Organization",
                    "Garage & Basement Decluttering",
                    "Home Office Organization",
                    "Paperwork & Document Sorting"
                ]
            },
            {
                subcategory: "Storage Unit Assistance",
                subSubcategories: [
                    "Packing & Organizing for Storage",
                    "Storage Unit Moving & Setup",
                    "Storage Unit Cleanout & Junk Removal",
                    "Climate-Controlled Storage Solutions"
                ]
            },
            {
                subcategory: "Furniture & Space Optimization",
                subSubcategories: [
                    "Custom Shelving Installation",
                    "Under-Bed Storage Solutions",
                    "Wall-Mounted & Floating Shelves Installation",
                    "Modular & Space-Saving Furniture Setup"
                ]
            },
            {
                subcategory: "Garage & Outdoor Storage Solutions",
                subSubcategories: [
                    "Overhead & Wall-Mounted Garage Storage Installation",
                    "Tool & Equipment Storage Solutions",
                    "Bike Rack & Sports Equipment Organization",
                    "Outdoor Shed Installation & Organization"
                ]
            },
            {
                subcategory: "Business & Commercial Storage Solutions",
                subSubcategories: [
                    "Warehouse Organization & Inventory Management",
                    "Office Filing System Setup",
                    "Retail Storage & Backroom Optimization",
                    "Archiving & Document Storage Solutions"
                ]
            },
            {
                subcategory: "Moving & Temporary Storage Assistance",
                subSubcategories: [
                    "Packing & Labeling for Storage",
                    "Temporary Storage for Relocations",
                    "Downsizing & Estate Storage Solutions"
                ]
            },
            {
                subcategory: "Specialty Storage & Organization",
                subSubcategories: [
                    "Wine & Liquor Storage Setup",
                    "Hobby & Craft Room Organization",
                    "Holiday Decoration Storage Solutions",
                    "Collectibles & Memorabilia Display"
                ]
            }
        ]
    },
    {
        category: "Furniture Assembly",
        subcategories: [
            {
                subcategory: "Home Furniture Assembly",
                subSubcategories: [
                    "Bed Frame & Headboard Assembly",
                    "Dresser & Wardrobe Assembly",
                    "Nightstand & Side Table Assembly",
                    "Bookshelf & Storage Unit Assembly",
                    "Sofa & Couch Assembly"
                ]
            },
            {
                subcategory: "Office & Business Furniture Assembly",
                subSubcategories: [
                    "Office Desk & Chair Assembly",
                    "Conference Table Assembly",
                    "Filing Cabinet & Shelving Installation",
                    "Reception & Waiting Area Furniture Setup"
                ]
            },
            {
                subcategory: "Kitchen & Dining Room Furniture",
                subSubcategories: [
                    "Dining Table & Chair Assembly",
                    "Kitchen Island & Barstool Setup",
                    "Pantry & Kitchen Storage Assembly"
                ]
            },
            {
                subcategory: "Outdoor & Patio Furniture Assembly",
                subSubcategories: [
                    "Patio Table & Chair Setup",
                    "Outdoor Lounge & Swing Chair Assembly",
                    "Pergola & Gazebo Installation",
                    "Fire Pit & Outdoor Seating Setup"
                ]
            },
            {
                subcategory: "Children’s & Nursery Furniture",
                subSubcategories: [
                    "Crib & Changing Table Assembly",
                    "Kids’ Bed & Bunk Bed Setup",
                    "Playpen & Toy Storage Assembly"
                ]
            },
            {
                subcategory: "Storage & Shelving Installation",
                subSubcategories: [
                    "Closet Organizer & Wardrobe System Installation",
                    "Wall-Mounted & Floating Shelf Setup",
                    "Garage & Utility Rack Installation"
                ]
            },
            {
                subcategory: "Exercise & Specialty Equipment",
                subSubcategories: [
                    "Home Gym & Fitness Equipment Assembly",
                    "Treadmill & Exercise Bike Setup",
                    "Gaming Desk & Chair Assembly"
                ]
            },
            {
                subcategory: "IKEA & Flat-Pack Furniture Assembly",
                subSubcategories: [
                    "IKEA Furniture Assembly Services",
                    "Wayfair, Amazon, & Walmart Furniture Assembly",
                    "Custom Flat-Pack Furniture Setup"
                ]
            },
            {
                subcategory: "Disassembly & Moving Assistance",
                subSubcategories: [
                    "Furniture Disassembly for Moving",
                    "Reassembly at New Location",
                    "Furniture Modifications & Adjustments"
                ]
            }
        ]
    },
    {
        category: "Welding & Metal Fabrication Services",
        subcategories: [
            {
                subcategory: "General Welding & Fabrication",
                subSubcategories: [
                    "MIG, TIG, & Stick Welding",
                    "Arc Welding & Plasma Cutting",
                    "Mobile Welding Services",
                    "Custom Metal Fabrication"
                ]
            },
            {
                subcategory: "Structural & Industrial Welding",
                subSubcategories: [
                    "Steel Beam & Frame Welding",
                    "Pipe & Pipeline Welding",
                    "Heavy Equipment & Machinery Repair",
                    "Industrial Metal Fabrication"
                ]
            },
            {
                subcategory: "Automotive & Vehicle Welding",
                subSubcategories: [
                    "Car Frame & Chassis Repair",
                    "Motorcycle & ATV Welding",
                    "Custom Exhaust & Roll Cage Fabrication",
                    "Trailer Frame Welding & Repair"
                ]
            },
            {
                subcategory: "Residential & Decorative Metalwork",
                subSubcategories: [
                    "Custom Metal Gates & Fences",
                    "Handrails & Staircase Welding",
                    "Balcony & Deck Railing Fabrication",
                    "Ornamental & Decorative Ironwork"
                ]
            },
            {
                subcategory: "Commercial & Business Welding Services",
                subSubcategories: [
                    "Storefront Metal Fabrication",
                    "Commercial Kitchen Stainless Steel Welding",
                    "Warehouse & Industrial Facility Welding",
                    "Metal Staircase & Walkway Construction"
                ]
            },
            {
                subcategory: "Custom Metal Projects & Repairs",
                subSubcategories: [
                    "Custom Metal Furniture & Fixtures",
                    "Sculpture & Artistic Metalwork",
                    "Metal Table, Bed Frame & Shelving Fabrication",
                    "Outdoor Fire Pit & BBQ Grill Fabrication"
                ]
            },
            {
                subcategory: "Boat & Marine Welding Services",
                subSubcategories: [
                    "Aluminum & Stainless Steel Boat Welding",
                    "Dock & Marina Welding Repairs",
                    "Marine Structural Fabrication"
                ]
            },
            {
                subcategory: "Emergency & Mobile Welding Services",
                subSubcategories: [
                    "24/7 Emergency Welding Repairs",
                    "On-Site Structural Welding",
                    "Emergency Equipment & Trailer Repair"
                ]
            }
        ]
    }   
];

module.exports = categories;
