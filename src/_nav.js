import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCursor,
  cilNotes,
  cilPuzzle,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Supplier Registration',
    to: '/SupplierRegistration',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/registration',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/view-supplier',
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'Product',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/addProduct',
      },
      {
        component: CNavItem,
        name: 'List',
        to: '/productList',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewProduct',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Store Acceptance',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/storeAcceptance',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewstoreAcceptance',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Material Recipt',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/storeAcceptance',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewstoreAcceptance',
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'Material Requisition',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/storeAcceptance',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewstoreAcceptance',
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'Dispatch Report',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/storeAcceptance',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewstoreAcceptance',
      }
    ],
  },

  {
    component: CNavGroup,
    name: 'Purchase Requistion',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Registration',
        to: '/storeAcceptance',
      },
      {
        component: CNavItem,
        name: 'View',
        to: '/viewstoreAcceptance',
      }
    ],
  },
]

export default _nav
