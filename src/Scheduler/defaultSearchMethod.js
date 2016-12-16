
export default function ({resource, searchQuery}) {
  if(typeof searchQuery !== 'string') {
    throw new Error(':searchMethod implementation only support text search query.')
  }

  return resource.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
}