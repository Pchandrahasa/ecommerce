import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    searchFilter,
    changeCategory,
    changeRating,
    clearFilter,
  } = props

  const onClickClear = () => {
    clearFilter()
  }

  const onChangeSearch = event => {
    searchFilter(event.target.value)
  }

  const ratinglist = () => {
    const onClickRating = id => {
      changeRating(id)
    }

    return (
      <div className="star-container">
        <h1>rating</h1>
        {ratingsList.map(i => (
          <img
            src={i.imageUrl}
            key={i.ratingId}
            className="star-img"
            alt=""
            onClick={() => onClickRating(i.ratingId)}
          />
        ))}
      </div>
    )
  }
  const list = () => {
    const onClickCategory = id => {
      changeCategory(id)
    }

    return (
      <>
        {categoryOptions.map(i => (
          <p
            key={i.categoryId}
            onClick={() => onClickCategory(i.categoryId)}
            value={i.categoryId}
          >
            {i.name}
          </p>
        ))}
      </>
    )
  }

  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      <input type="search" className="search-input" onChange={onChangeSearch} />
      <div>{list()}</div>
      <div>{ratinglist()}</div>
      <button type="button" className="filter-button" onClick={onClickClear}>
        Clear Filter
      </button>
    </div>
  )
}

export default FiltersGroup
