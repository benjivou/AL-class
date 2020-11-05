package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.example.myapplication.R
import com.example.myapplication.databinding.HomeFragmentBinding
import com.example.myapplication.ui.viewmodels.ProfileViewModel
import kotlinx.android.synthetic.main.home_fragment.*


/**
 * A simple [Fragment] subclass.
 * Use the [HomePageFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class HomePageFragment : Fragment() {

    private val userViewModel: ProfileViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = HomeFragmentBinding.inflate(inflater, container, false).root

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        goScanQRbtn.setOnClickListener { findNavController().navigate(HomePageFragmentDirections.actionHomePageToScanQr()) }
        goToFraudeBtn.setOnClickListener { findNavController().navigate(HomePageFragmentDirections.actionHomePageToManuallFraudFormulaire()) }
        consultStatsBtn.setOnClickListener {
            findNavController().navigate(HomePageFragmentDirections.actionHomePageToLoadingStats("ab3678293002"))
        }

        // ecoute de la connexion de l'utilisateur
        userViewModel.user.observe(viewLifecycleOwner, Observer { user ->
            if (user == null) {
                findNavController().navigate(R.id.loginFragment)
            }
        })
    }

}
