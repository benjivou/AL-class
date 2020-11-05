package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.myapplication.R
import com.example.myapplication.databinding.ActivityMainBinding.bind
import com.example.myapplication.databinding.FragmentConnectionIssuesBinding
import com.example.myapplication.databinding.FragmentOptionalTestBinding

class ConnectionIssuesFragment : Fragment() {
    private val args: ConnectionIssuesFragmentArgs by navArgs()
    private var binding: FragmentConnectionIssuesBinding? =  null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_connection_issues, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?){
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentConnectionIssuesBinding.bind(view)
        binding!!.connectionIssuesTextView.text = args.networkIssue
        binding!!.returnHomeBtn.setOnClickListener {
            findNavController().navigate(ConnectionIssuesFragmentDirections.actionConnectionIssuesFragmentToHomepageFragment())
        }

    }
    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}