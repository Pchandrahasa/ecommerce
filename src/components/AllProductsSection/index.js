import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apisStatus = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryActiveId: '',
    activeRatingId: '',
    currentApisStatus: apisStatus.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  clearFilter = () => {
    this.setState(
      {categoryActiveId: '', activeRatingId: '', searchInput: ''},
      this.getProducts,
    )
  }

  changeRating = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  changeCategory = id => {
    this.setState({categoryActiveId: id}, this.getProducts)
  }

  searchFilter = updatedSearch => {
    this.setState({searchInput: updatedSearch}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({
      currentApisStatus: apisStatus.inprogress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      categoryActiveId,
      activeRatingId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchInput}&category=${categoryActiveId}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          currentApisStatus: apisStatus.success,
        })
      } else {
        this.setState({currentApisStatus: apisStatus.failure})
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      this.setState({currentApisStatus: apisStatus.failure})
    }
  }

  renderAllProducts = () => {
    const {currentApisStatus} = this.state

    switch (currentApisStatus) {
      case apisStatus.success:
        return this.renderProductsList()

      case apisStatus.inprogress:
        return this.renderLoader()

      case apisStatus.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we are having some trouble</p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  render() {
    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          searchFilter={this.searchFilter}
          changeCategory={this.changeCategory}
          changeRating={this.changeRating}
          clearFilter={this.clearFilter}
        />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
