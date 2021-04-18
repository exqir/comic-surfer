import { gql } from 'apollo-server'

export default gql`
  enum TaskType {
    SCRAPCOMICBOOKLIST
    ADDCOMICBOOK
    UPDATECOMICBOOK
    UPDATECOMICBOOKRELEASE
    UPDATECOMICSERIESPUBLISHER
  }

  interface Task @abstractEntity(discriminatorField: "type") {
    """
    ID of the Task.
    """
    _id: ID! @id
    """
    Type of the Task.
    """
    type: TaskType! @column
  }

  type AddComicBookTask implements Task @entity {
    """
    ID of the Task.
    """
    _id: ID!
    """
    Type of the Task.
    """
    type: TaskType!
    """
    The data for the add ComicBook Task.
    """
    data: AddComicBookTaskData @embedded
  }

  type AddComicBookTaskData @entity(embedded: true) {
    """
    Url of the ComciBook to add.
    """
    url: String @column
    """
    ComicSeries the ComicBook should be added to.
    """
    comicSeriesId: ID @column
    """
    Type of the ComicBook to be added.
    """
    type: ComicBookType @column
  }

  type ScrapComicBookListTask implements Task @entity {
    """
    ID of the Task.
    """
    _id: ID!
    """
    Type of the Task.
    """
    type: TaskType!
    """
    The data for the scrap ComicBook List Task.
    """
    data: ScrapComicBookListTaskData @embedded
  }

  type ScrapComicBookListTaskData @entity(embedded: true) {
    """
    Url of the ComicBook List to scrap.
    """
    url: String @column
    """
    ComicSeries the ComicBook List belongs to.
    """
    comicSeriesId: ID @column
    """
    Type of ComicBooks on the List.
    """
    type: ComicBookType @column
  }

  type UpdateComicBookReleaseTask implements Task @entity {
    """
    ID of the Task.
    """
    _id: ID!
    """
    Type of the Task.
    """
    type: TaskType!
    """
    The data for the scrap ComicBook List Task.
    """
    data: UpdateComicBookReleaseTaskData @embedded
  }

  type UpdateComicBookReleaseTaskData @entity(embedded: true) {
    """
    Id of the ComicBook to update release date for.
    """
    comicBookId: ID @column
  }

  type UpdateComicSeriesPublisherTask implements Task @entity {
    """
    ID of the Task.
    """
    _id: ID!
    """
    Type of the Task.
    """
    type: TaskType!
    """
    The data for the scrap ComicBook List Task.
    """
    data: UpdateComicSeriesPublisherTaskData @embedded
  }

  type UpdateComicSeriesPublisherTaskData @entity(embedded: true) {
    """
    Id of the ComicSeries to update the publisher for.
    """
    comicSeriesId: ID @column
  }

  type UpdateComicBookTask implements Task @entity {
    """
    ID of the Task.
    """
    _id: ID!
    """
    Type of the Task.
    """
    type: TaskType!
    """
    The data for the scrap ComicBook List Task.
    """
    data: UpdateComicBookTaskData @embedded
  }

  type UpdateComicBookTaskData @entity(embedded: true) {
    """
    Id of the ComicSeries to update the publisher for.
    """
    comicSeriesId: ID @column
  }
`
