import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  createPackage,
  createShop,
  createTourService,
  deleteDestination,
  deletePackage,
  deleteShop,
  deleteTourService,
  deleteUser,
  getDestinations,
  getPackages,
  getShops,
  getTourServices,
  getUsers,
  updatePackage,
  updateShop,
  updateTourService,
} from "../services/api";
import "./AdminDashboard.css";

const FALLBACK_PACKAGE_CATEGORIES = ["Beach", "Culture", "Nature", "Wildlife", "Wellness", "Holiday"];
const FALLBACK_SHOP_CATEGORIES = [
  "Coffee Shops",
  "Jewellery",
  "Spa & Wellness",
  "Clothing",
  "Spices & Tea",
  "Souvenirs",
  "Supermarkets",
  "Furniture & Home",
  "Beauty & Cosmetics",
  "Bookshops",
];
const FALLBACK_TOUR_CATEGORIES = [
  "Tuk Tuk Rides",
  "Van with Driver",
  "Airport Transfers",
  "Private Car",
  "Safari Jeeps",
  "Coaches",
];
const FILTER_CATEGORY = "All";

function buildEmptyPackageDraft(categories = FALLBACK_PACKAGE_CATEGORIES) {
  return {
    title: "",
    slug: "",
    category: categories[0] || FALLBACK_PACKAGE_CATEGORIES[0],
    days: "3",
    price: "",
    text: "",
    image: "",
  };
}

function buildEmptyShopDraft(categories = []) {
  return {
    id: "",
    name: "",
    category: categories[0] || "",
    location: "",
    description: "",
    priceRange: "",
    tag: "",
    image: "",
    openHours: "",
    phone: "",
    website: "",
    rating: "4.5",
    reviewCount: "0",
  };
}

function buildEmptyTourDraft(categories = []) {
  return {
    id: "",
    name: "",
    category: categories[0] || "",
    location: "",
    description: "",
    priceRange: "",
    tag: "",
    image: "",
    availability: "",
    vehicle: "",
    idealFor: "",
    phone: "",
    whatsapp: "",
    rating: "4.5",
    reviewCount: "0",
  };
}

function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

function getEditableCategories(categories = [], fallbackCategories = []) {
  const nextCategories = categories.filter((category) => category && category !== FILTER_CATEGORY);
  return nextCategories.length ? nextCategories : fallbackCategories;
}

function sortByDisplayOrder(items) {
  return [...items].sort((left, right) => {
    const leftOrder = left.displayOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.displayOrder ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function sortDestinations(items) {
  return [...items].sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));
}

function sortUsers(items) {
  return [...items].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString();
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyKey, setBusyKey] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [shops, setShops] = useState([]);
  const [tourServices, setTourServices] = useState([]);
  const [users, setUsers] = useState([]);

  const [packageCategories, setPackageCategories] = useState(FALLBACK_PACKAGE_CATEGORIES);
  const [shopCategories, setShopCategories] = useState(FALLBACK_SHOP_CATEGORIES);
  const [tourCategories, setTourCategories] = useState(FALLBACK_TOUR_CATEGORIES);

  const [editingPackageSlug, setEditingPackageSlug] = useState("");
  const [editingShopId, setEditingShopId] = useState("");
  const [editingTourId, setEditingTourId] = useState("");

  const [packageDraft, setPackageDraft] = useState(() => buildEmptyPackageDraft());
  const [shopDraft, setShopDraft] = useState(() => buildEmptyShopDraft(FALLBACK_SHOP_CATEGORIES));
  const [tourDraft, setTourDraft] = useState(() => buildEmptyTourDraft(FALLBACK_TOUR_CATEGORIES));

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadCatalogs = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [packagesResponse, destinationsResponse, shopsResponse, toursResponse, usersResponse] = await Promise.all([
        getPackages(),
        getDestinations(),
        getShops(),
        getTourServices(),
        getUsers(),
      ]);

      if (!isMountedRef.current) {
        return;
      }

      const nextPackageCategories = getEditableCategories(
        packagesResponse.data.categories,
        FALLBACK_PACKAGE_CATEGORIES
      );
      const nextShopCategories = getEditableCategories(
        shopsResponse.data.categories,
        FALLBACK_SHOP_CATEGORIES
      );
      const nextTourCategories = getEditableCategories(
        toursResponse.data.categories,
        FALLBACK_TOUR_CATEGORIES
      );

      setPackages(sortByDisplayOrder(packagesResponse.data.packages || []));
      setDestinations(sortDestinations(destinationsResponse.data || []));
      setShops(sortByDisplayOrder(shopsResponse.data.shops || []));
      setTourServices(sortByDisplayOrder(toursResponse.data.services || []));
      setUsers(sortUsers(usersResponse.data || []));
      setPackageCategories(nextPackageCategories);
      setShopCategories(nextShopCategories);
      setTourCategories(nextTourCategories);
      setError("");
    } catch (requestError) {
      if (isMountedRef.current) {
        setError(getErrorMessage(requestError, "Unable to load the admin dashboard right now."));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  useEffect(() => {
    if (packageCategories.length && !packageDraft.category) {
      setPackageDraft((current) => ({ ...current, category: packageCategories[0] }));
    }
  }, [packageCategories, packageDraft.category]);

  useEffect(() => {
    if (shopCategories.length && !shopDraft.category) {
      setShopDraft((current) => ({ ...current, category: shopCategories[0] }));
    }
  }, [shopCategories, shopDraft.category]);

  useEffect(() => {
    if (tourCategories.length && !tourDraft.category) {
      setTourDraft((current) => ({ ...current, category: tourCategories[0] }));
    }
  }, [tourCategories, tourDraft.category]);

  const resetPackageForm = () => {
    setEditingPackageSlug("");
    setPackageDraft(buildEmptyPackageDraft(packageCategories));
  };

  const resetShopForm = () => {
    setEditingShopId("");
    setShopDraft(buildEmptyShopDraft(shopCategories));
  };

  const resetTourForm = () => {
    setEditingTourId("");
    setTourDraft(buildEmptyTourDraft(tourCategories));
  };

  const handlePackageChange = (event) => {
    const { name, value } = event.target;
    setPackageDraft((current) => ({ ...current, [name]: value }));
  };

  const handleShopChange = (event) => {
    const { name, value } = event.target;
    setShopDraft((current) => ({ ...current, [name]: value }));
  };

  const handleTourChange = (event) => {
    const { name, value } = event.target;
    setTourDraft((current) => ({ ...current, [name]: value }));
  };

  const editPackage = (pkg) => {
    setEditingPackageSlug(pkg.slug);
    setPackageDraft({
      title: pkg.title || "",
      slug: pkg.slug || "",
      category: pkg.category || packageCategories[0] || FALLBACK_PACKAGE_CATEGORIES[0],
      days: String(pkg.days ?? ""),
      price: String(pkg.price ?? ""),
      text: pkg.text || "",
      image: pkg.image || "",
    });
  };

  const editShop = (shop) => {
    setEditingShopId(shop.id);
    setShopDraft({
      id: shop.id || "",
      name: shop.name || "",
      category: shop.category || shopCategories[0] || "",
      location: shop.location || "",
      description: shop.description || "",
      priceRange: shop.priceRange || "",
      tag: shop.tag || "",
      image: shop.image || "",
      openHours: shop.openHours || "",
      phone: shop.phone || "",
      website: shop.website || "",
      rating: String(shop.rating ?? "4.5"),
      reviewCount: String(shop.reviewCount ?? "0"),
    });
  };

  const editTour = (service) => {
    setEditingTourId(service.id);
    setTourDraft({
      id: service.id || "",
      name: service.name || "",
      category: service.category || tourCategories[0] || "",
      location: service.location || "",
      description: service.description || "",
      priceRange: service.priceRange || "",
      tag: service.tag || "",
      image: service.image || "",
      availability: service.availability || "",
      vehicle: service.vehicle || "",
      idealFor: service.idealFor || "",
      phone: service.phone || "",
      whatsapp: service.whatsapp || "",
      rating: String(service.rating ?? "4.5"),
      reviewCount: String(service.reviewCount ?? "0"),
    });
  };

  const handlePackageSubmit = async (event) => {
    event.preventDefault();
    setBusyKey("package-submit");
    setError("");
    setNotice("");

    try {
      const payload = {
        title: packageDraft.title,
        slug: packageDraft.slug,
        category: packageDraft.category,
        days: packageDraft.days,
        price: packageDraft.price,
        text: packageDraft.text,
        image: packageDraft.image,
      };

      if (editingPackageSlug) {
        await updatePackage(editingPackageSlug, payload);
        setNotice("Package updated.");
      } else {
        await createPackage(payload);
        setNotice("Package created.");
      }

      resetPackageForm();
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save the package."));
    } finally {
      setBusyKey("");
    }
  };

  const handleShopSubmit = async (event) => {
    event.preventDefault();
    setBusyKey("shop-submit");
    setError("");
    setNotice("");

    try {
      const payload = {
        id: shopDraft.id,
        name: shopDraft.name,
        category: shopDraft.category,
        location: shopDraft.location,
        description: shopDraft.description,
        priceRange: shopDraft.priceRange,
        tag: shopDraft.tag,
        image: shopDraft.image,
        openHours: shopDraft.openHours,
        phone: shopDraft.phone,
        website: shopDraft.website,
        rating: shopDraft.rating,
        reviewCount: shopDraft.reviewCount,
      };

      if (editingShopId) {
        await updateShop(editingShopId, payload);
        setNotice("Shop updated.");
      } else {
        await createShop(payload);
        setNotice("Shop created.");
      }

      resetShopForm();
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save the shop."));
    } finally {
      setBusyKey("");
    }
  };

  const handleTourSubmit = async (event) => {
    event.preventDefault();
    setBusyKey("tour-submit");
    setError("");
    setNotice("");

    try {
      const payload = {
        id: tourDraft.id,
        name: tourDraft.name,
        category: tourDraft.category,
        location: tourDraft.location,
        description: tourDraft.description,
        priceRange: tourDraft.priceRange,
        tag: tourDraft.tag,
        image: tourDraft.image,
        availability: tourDraft.availability,
        vehicle: tourDraft.vehicle,
        idealFor: tourDraft.idealFor,
        phone: tourDraft.phone,
        whatsapp: tourDraft.whatsapp,
        rating: tourDraft.rating,
        reviewCount: tourDraft.reviewCount,
      };

      if (editingTourId) {
        await updateTourService(editingTourId, payload);
        setNotice("Tour service updated.");
      } else {
        await createTourService(payload);
        setNotice("Tour service created.");
      }

      resetTourForm();
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to save the tour service."));
    } finally {
      setBusyKey("");
    }
  };

  const handlePackageDelete = async (slug) => {
    if (!window.confirm("Delete this package?")) {
      return;
    }

    setBusyKey(`package-delete-${slug}`);
    setError("");
    setNotice("");

    try {
      await deletePackage(slug);
      if (editingPackageSlug === slug) {
        resetPackageForm();
      }
      setNotice("Package deleted.");
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete the package."));
    } finally {
      setBusyKey("");
    }
  };

  const handleDestinationDelete = async (id) => {
    if (!window.confirm("Delete this destination?")) {
      return;
    }

    setBusyKey(`destination-delete-${id}`);
    setError("");
    setNotice("");

    try {
      await deleteDestination(id);
      setNotice("Destination deleted.");
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete the destination."));
    } finally {
      setBusyKey("");
    }
  };

  const handleShopDelete = async (id) => {
    if (!window.confirm("Delete this shop?")) {
      return;
    }

    setBusyKey(`shop-delete-${id}`);
    setError("");
    setNotice("");

    try {
      await deleteShop(id);
      if (editingShopId === id) {
        resetShopForm();
      }
      setNotice("Shop deleted.");
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete the shop."));
    } finally {
      setBusyKey("");
    }
  };

  const handleTourDelete = async (id) => {
    if (!window.confirm("Delete this tour service?")) {
      return;
    }

    setBusyKey(`tour-delete-${id}`);
    setError("");
    setNotice("");

    try {
      await deleteTourService(id);
      if (editingTourId === id) {
        resetTourForm();
      }
      setNotice("Tour service deleted.");
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete the tour service."));
    } finally {
      setBusyKey("");
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm("Delete this user account? This will also remove their bookings, reviews, and chat messages.")) {
      return;
    }

    setBusyKey(`user-delete-${id}`);
    setError("");
    setNotice("");

    try {
      await deleteUser(id);
      setNotice("User deleted.");
      await loadCatalogs({ silent: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete the user."));
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="admin-page" aria-busy={loading || refreshing || Boolean(busyKey)}>
      <header className="admin-topbar">
        <div>
          <Link to="/" className="admin-brand">Ceylon Explore</Link>
          <p className="admin-topbar-copy">Admin control room</p>
        </div>
        <nav className="admin-topbar-nav" aria-label="Admin navigation">
          <Link to="/">Home</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/shopping">Shopping</Link>
          <Link to="/tours">Tours</Link>
        </nav>
        <div className="admin-topbar-actions">
          <div className="admin-user-pill">
            <span className="admin-user-role">Admin</span>
            <strong>{user?.name || "Administrator"}</strong>
          </div>
          <button
            type="button"
            className="admin-ghost-btn"
            onClick={() => loadCatalogs({ silent: true })}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            className="admin-ghost-btn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        {loading ? <div className="admin-banner admin-banner--loading">Loading live catalog data...</div> : null}

        <section className="admin-hero">
          <div>
            <p className="admin-eyebrow">Operations</p>
            <h1>Manage packages, destinations, shops, transport, and users in one place.</h1>
            <p className="admin-hero-copy">
              This dashboard is wired directly to the live admin APIs, so every create, edit, and delete updates the same data used by the public site.
            </p>
          </div>
          <div className="admin-hero-grid">
            <article className="admin-stat-card">
              <span className="admin-stat-label">Packages</span>
              <strong>{packages.length}</strong>
              <p>Trip bundles available on the destination catalog.</p>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-label">Destinations</span>
              <strong>{destinations.length}</strong>
              <p>Stay options shown in destination listings.</p>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-label">Shops</span>
              <strong>{shops.length}</strong>
              <p>Shopping and coffee stops published on the site.</p>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-label">Tour Services</span>
              <strong>{tourServices.length}</strong>
              <p>Drivers, transfers, and transport offers live now.</p>
            </article>
            <article className="admin-stat-card">
              <span className="admin-stat-label">Users</span>
              <strong>{users.length}</strong>
              <p>Registered accounts that can book, chat, and sign in.</p>
            </article>
          </div>
        </section>

        {error ? <div className="admin-banner admin-banner--error">{error}</div> : null}
        {notice ? <div className="admin-banner admin-banner--success">{notice}</div> : null}

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <p className="admin-eyebrow">Packages</p>
              <h2>Destination package catalog</h2>
            </div>
            <span>{packages.length} entries</span>
          </div>
          <div className="admin-section-grid">
            <form className="admin-form-card" onSubmit={handlePackageSubmit}>
              <div className="admin-form-head">
                <h3>{editingPackageSlug ? "Edit package" : "Create package"}</h3>
                <button type="button" className="admin-text-btn" onClick={resetPackageForm}>Clear</button>
              </div>
              <div className="admin-form-grid">
                <label>
                  <span>Title</span>
                  <input name="title" value={packageDraft.title} onChange={handlePackageChange} required />
                </label>
                <label>
                  <span>Slug</span>
                  <input name="slug" value={packageDraft.slug} onChange={handlePackageChange} placeholder="Auto generated if left blank" />
                </label>
                <label>
                  <span>Category</span>
                  <select name="category" value={packageDraft.category} onChange={handlePackageChange} required>
                    {packageCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Days</span>
                  <input name="days" type="number" min="1" value={packageDraft.days} onChange={handlePackageChange} required />
                </label>
                <label>
                  <span>Price</span>
                  <input name="price" type="number" min="1" value={packageDraft.price} onChange={handlePackageChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Image URL</span>
                  <input name="image" value={packageDraft.image} onChange={handlePackageChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Description</span>
                  <textarea name="text" rows="4" value={packageDraft.text} onChange={handlePackageChange} required />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-btn" disabled={Boolean(busyKey)}>
                  {busyKey === "package-submit" ? "Saving..." : editingPackageSlug ? "Update package" : "Create package"}
                </button>
                {editingPackageSlug ? (
                  <button type="button" className="admin-ghost-btn" onClick={resetPackageForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="admin-table-card">
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Days</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.slug}>
                        <td>
                          <strong>{pkg.title}</strong>
                          <span>{pkg.slug}</span>
                        </td>
                        <td>{pkg.category}</td>
                        <td>{pkg.days} days</td>
                        <td>LKR {Number(pkg.price).toLocaleString()}</td>
                        <td className="admin-row-actions">
                          <button type="button" className="admin-text-btn" onClick={() => editPackage(pkg)}>Edit</button>
                          <button
                            type="button"
                            className="admin-text-btn admin-text-btn--danger"
                            onClick={() => handlePackageDelete(pkg.slug)}
                            disabled={busyKey === `package-delete-${pkg.slug}`}
                          >
                            {busyKey === `package-delete-${pkg.slug}` ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <p className="admin-eyebrow">Destinations</p>
              <h2>Stay catalog</h2>
            </div>
            <span>{destinations.length} entries</span>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((destination) => (
                    <tr key={destination._id}>
                      <td>
                        <strong>{destination.name}</strong>
                        <span>{destination.tag || "-"}</span>
                      </td>
                      <td>{destination.location || "-"}</td>
                      <td>{destination.category || "-"}</td>
                      <td>{destination.price ? `LKR ${Number(destination.price).toLocaleString()}` : "-"}</td>
                      <td className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-text-btn admin-text-btn--danger"
                          onClick={() => handleDestinationDelete(destination._id)}
                          disabled={busyKey === `destination-delete-${destination._id}`}
                        >
                          {busyKey === `destination-delete-${destination._id}` ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <p className="admin-eyebrow">Users</p>
              <h2>Registered members</h2>
            </div>
            <span>{users.length} entries</span>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Provider</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((member) => {
                    const isCurrentAdmin = member.id === user?.id;

                    return (
                      <tr key={member.id}>
                        <td>
                          <strong>{member.name}</strong>
                          <span>{isCurrentAdmin ? "Current session" : member.id}</span>
                        </td>
                        <td>{member.email}</td>
                        <td>{member.role}</td>
                        <td>{member.authProvider}</td>
                        <td>{formatDate(member.createdAt)}</td>
                        <td className="admin-row-actions">
                          {isCurrentAdmin ? (
                            <span>Current account</span>
                          ) : (
                            <button
                              type="button"
                              className="admin-text-btn admin-text-btn--danger"
                              onClick={() => handleUserDelete(member.id)}
                              disabled={busyKey === `user-delete-${member.id}`}
                            >
                              {busyKey === `user-delete-${member.id}` ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <p className="admin-eyebrow">Shopping</p>
              <h2>Shop catalog</h2>
            </div>
            <span>{shops.length} entries</span>
          </div>
          <div className="admin-section-grid">
            <form className="admin-form-card" onSubmit={handleShopSubmit}>
              <div className="admin-form-head">
                <h3>{editingShopId ? "Edit shop" : "Create shop"}</h3>
                <button type="button" className="admin-text-btn" onClick={resetShopForm}>Clear</button>
              </div>
              <div className="admin-form-grid">
                <label>
                  <span>Shop ID</span>
                  <input name="id" value={shopDraft.id} onChange={handleShopChange} placeholder="Auto generated if left blank" />
                </label>
                <label>
                  <span>Name</span>
                  <input name="name" value={shopDraft.name} onChange={handleShopChange} required />
                </label>
                <label>
                  <span>Category</span>
                  <select name="category" value={shopDraft.category} onChange={handleShopChange} required>
                    {shopCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Location</span>
                  <input name="location" value={shopDraft.location} onChange={handleShopChange} required />
                </label>
                <label>
                  <span>Price Range</span>
                  <input name="priceRange" value={shopDraft.priceRange} onChange={handleShopChange} required />
                </label>
                <label>
                  <span>Tag</span>
                  <input name="tag" value={shopDraft.tag} onChange={handleShopChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Image URL</span>
                  <input name="image" value={shopDraft.image} onChange={handleShopChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Description</span>
                  <textarea name="description" rows="4" value={shopDraft.description} onChange={handleShopChange} required />
                </label>
                <label>
                  <span>Open Hours</span>
                  <input name="openHours" value={shopDraft.openHours} onChange={handleShopChange} />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" value={shopDraft.phone} onChange={handleShopChange} />
                </label>
                <label>
                  <span>Website</span>
                  <input name="website" value={shopDraft.website} onChange={handleShopChange} />
                </label>
                <label>
                  <span>Rating</span>
                  <input name="rating" type="number" min="0" max="5" step="0.1" value={shopDraft.rating} onChange={handleShopChange} />
                </label>
                <label>
                  <span>Review Count</span>
                  <input name="reviewCount" type="number" min="0" value={shopDraft.reviewCount} onChange={handleShopChange} />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-btn" disabled={Boolean(busyKey)}>
                  {busyKey === "shop-submit" ? "Saving..." : editingShopId ? "Update shop" : "Create shop"}
                </button>
                {editingShopId ? (
                  <button type="button" className="admin-ghost-btn" onClick={resetShopForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="admin-table-card">
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Tag</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shops.map((shop) => (
                      <tr key={shop.id}>
                        <td>
                          <strong>{shop.name}</strong>
                          <span>{shop.id}</span>
                        </td>
                        <td>{shop.category}</td>
                        <td>{shop.location}</td>
                        <td>{shop.tag}</td>
                        <td className="admin-row-actions">
                          <button type="button" className="admin-text-btn" onClick={() => editShop(shop)}>Edit</button>
                          <button
                            type="button"
                            className="admin-text-btn admin-text-btn--danger"
                            onClick={() => handleShopDelete(shop.id)}
                            disabled={busyKey === `shop-delete-${shop.id}`}
                          >
                            {busyKey === `shop-delete-${shop.id}` ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <p className="admin-eyebrow">Transport</p>
              <h2>Tour and ride services</h2>
            </div>
            <span>{tourServices.length} entries</span>
          </div>
          <div className="admin-section-grid">
            <form className="admin-form-card" onSubmit={handleTourSubmit}>
              <div className="admin-form-head">
                <h3>{editingTourId ? "Edit tour service" : "Create tour service"}</h3>
                <button type="button" className="admin-text-btn" onClick={resetTourForm}>Clear</button>
              </div>
              <div className="admin-form-grid">
                <label>
                  <span>Service ID</span>
                  <input name="id" value={tourDraft.id} onChange={handleTourChange} placeholder="Auto generated if left blank" />
                </label>
                <label>
                  <span>Name</span>
                  <input name="name" value={tourDraft.name} onChange={handleTourChange} required />
                </label>
                <label>
                  <span>Category</span>
                  <select name="category" value={tourDraft.category} onChange={handleTourChange} required>
                    {tourCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Location</span>
                  <input name="location" value={tourDraft.location} onChange={handleTourChange} required />
                </label>
                <label>
                  <span>Price Range</span>
                  <input name="priceRange" value={tourDraft.priceRange} onChange={handleTourChange} required />
                </label>
                <label>
                  <span>Tag</span>
                  <input name="tag" value={tourDraft.tag} onChange={handleTourChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Image URL</span>
                  <input name="image" value={tourDraft.image} onChange={handleTourChange} required />
                </label>
                <label className="admin-field-span-2">
                  <span>Description</span>
                  <textarea name="description" rows="4" value={tourDraft.description} onChange={handleTourChange} required />
                </label>
                <label>
                  <span>Availability</span>
                  <input name="availability" value={tourDraft.availability} onChange={handleTourChange} />
                </label>
                <label>
                  <span>Vehicle</span>
                  <input name="vehicle" value={tourDraft.vehicle} onChange={handleTourChange} />
                </label>
                <label>
                  <span>Ideal For</span>
                  <input name="idealFor" value={tourDraft.idealFor} onChange={handleTourChange} />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" value={tourDraft.phone} onChange={handleTourChange} />
                </label>
                <label>
                  <span>WhatsApp</span>
                  <input name="whatsapp" value={tourDraft.whatsapp} onChange={handleTourChange} />
                </label>
                <label>
                  <span>Rating</span>
                  <input name="rating" type="number" min="0" max="5" step="0.1" value={tourDraft.rating} onChange={handleTourChange} />
                </label>
                <label>
                  <span>Review Count</span>
                  <input name="reviewCount" type="number" min="0" value={tourDraft.reviewCount} onChange={handleTourChange} />
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-btn" disabled={Boolean(busyKey)}>
                  {busyKey === "tour-submit" ? "Saving..." : editingTourId ? "Update service" : "Create service"}
                </button>
                {editingTourId ? (
                  <button type="button" className="admin-ghost-btn" onClick={resetTourForm}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="admin-table-card">
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Tag</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourServices.map((service) => (
                      <tr key={service.id}>
                        <td>
                          <strong>{service.name}</strong>
                          <span>{service.id}</span>
                        </td>
                        <td>{service.category}</td>
                        <td>{service.location}</td>
                        <td>{service.tag}</td>
                        <td className="admin-row-actions">
                          <button type="button" className="admin-text-btn" onClick={() => editTour(service)}>Edit</button>
                          <button
                            type="button"
                            className="admin-text-btn admin-text-btn--danger"
                            onClick={() => handleTourDelete(service.id)}
                            disabled={busyKey === `tour-delete-${service.id}`}
                          >
                            {busyKey === `tour-delete-${service.id}` ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;